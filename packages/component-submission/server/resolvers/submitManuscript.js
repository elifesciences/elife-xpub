const config = require('config')
const Joi = require('joi')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const models = require('@pubsweet/models')
const { mecaExport } = require('@elifesciences/component-meca')

const { S3Storage } = require('@elifesciences/component-service-s3')
const manuscriptInputSchema = require('../helpers/manuscriptInputValidationSchema')
const { Manuscript } = require('../use-cases')
const { Notification } = require('../services')

async function submitManuscript(_, { data }, { user, ip }) {
  const userUuid = await models.User.getUuidForProfile(user)
  let manuscriptModel = await models.Manuscript.find(data.id, userUuid)
  if (manuscriptModel.status !== models.Manuscript.statuses.INITIAL) {
    throw new Error(
      `Cannot submit manuscript with status of ${manuscriptModel.status}`,
    )
  }

  const manuscriptInput = models.Manuscript.removeOptionalBlankReviewers(data)
  const { error: errorManuscript } = Joi.validate(
    manuscriptInput,
    manuscriptInputSchema,
  )
  if (errorManuscript) {
    logger.error(`Bad manuscript data: ${errorManuscript}`)
    throw new Error(errorManuscript)
  }

  manuscriptModel.applyInput(manuscriptInput)

  logger.info(`Submitting ${manuscriptModel.id}`)
  manuscriptModel.files.forEach(file =>
    logger.info(`File: ${file.id} | ${file.type}`),
  )

  const sourceFile = await manuscriptModel.getSource()
  if (!sourceFile) {
    throw new Error('Manuscript has no source file', {
      manuscriptId: manuscriptModel.id,
    })
  }

  await manuscriptModel.save()

  if (manuscriptModel.fileStatus !== 'READY') {
    throw new Error('Manuscript fileStatus is CHANGING', {
      manuscriptId: manuscriptModel.id,
    })
  }

  manuscriptModel = await models.Manuscript.updateStatus(
    manuscriptModel.id,
    models.Manuscript.statuses.MECA_EXPORT_PENDING,
  )

  // This function can take a while so do not await this (apart from in tests)
  return mecaExport(manuscriptModel, S3Storage.getContent, ip)
    .then(async () => {
      logger.info(`Manuscript ${manuscriptModel.id} successfully exported`)
      const manuscript = new Manuscript(config, userUuid, S3Storage)
      const notify = new Notification(config)
      await notify.sendFinalSubmissionEmail(manuscriptModel)
      await models.Manuscript.updateStatus(
        manuscriptModel.id,
        models.Manuscript.statuses.MECA_EXPORT_SUCCEEDED,
      )

      return manuscript.getView(manuscriptModel.id)
    })
    .catch(async err => {
      logger.error('MECA export failed', err)
      await models.Manuscript.updateStatus(
        manuscriptModel.id,
        models.Manuscript.statuses.MECA_EXPORT_FAILED,
      )
      return mailer.send({
        to: config.get('meca.email.recipient'),
        from: config.get('meca.email.sender'),
        subject: `${config.get('meca.email.subjectPrefix')}MECA export failed`,
        text: `Manuscript ID: ${manuscriptModel.id}
Manuscript title: ${manuscriptModel.meta.title}
Error:

${err}`,
      })
    })
    .catch(err => {
      logger.error('Error handling MECA export failure', err)
    })
}

module.exports = submitManuscript
