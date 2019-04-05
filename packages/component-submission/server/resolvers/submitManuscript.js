const config = require('config')
const Joi = require('joi')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const { mecaExport } = require('@elifesciences/component-meca')
const User = require('@elifesciences/component-model-user').model
const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model
const { S3Storage } = require('@elifesciences/component-service-s3')
const manuscriptInputSchema = require('../helpers/manuscriptInputValidationSchema')
const { Manuscript } = require('../use-cases')
const { Notification } = require('../services')

async function submitManuscript(_, { data }, { user, ip }) {
  const userUuid = await User.getUuidForProfile(user)
  let manuscriptModel = await ManuscriptModel.find(data.id, userUuid)
  if (manuscriptModel.status !== ManuscriptModel.statuses.INITIAL) {
    throw new Error(
      `Cannot submit manuscript with status of ${manuscriptModel.status}`,
    )
  }

  const manuscriptInput = ManuscriptModel.removeOptionalBlankReviewers(data)
  const { error: errorManuscript } = Joi.validate(
    manuscriptInput,
    manuscriptInputSchema,
  )
  if (errorManuscript) {
    logger.error(`Bad manuscript data: ${errorManuscript}`)
    throw new Error(errorManuscript)
  }

  manuscriptModel.applyInput(manuscriptInput)

  const sourceFile = manuscriptModel.getSource()
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

  const manuscript = new Manuscript(config, userUuid, S3Storage)

  manuscriptModel = await ManuscriptModel.updateStatus(
    manuscriptModel.id,
    ManuscriptModel.statuses.MECA_EXPORT_PENDING,
  )

  await mecaExport(manuscriptModel, S3Storage.getContent, ip)
    .then(async () => {
      logger.info(`Manuscript ${manuscriptModel.id} successfully exported`)
      const notify = new Notification(config)
      await notify.sendFinalSubmissionEmail(manuscriptModel)
      ManuscriptModel.updateStatus(
        manuscriptModel.id,
        ManuscriptModel.statuses.MECA_EXPORT_SUCCEEDED,
      )
    })
    .catch(async err => {
      logger.error('MECA export failed', err)
      await ManuscriptModel.updateStatus(
        manuscriptModel.id,
        ManuscriptModel.statuses.MECA_EXPORT_FAILED,
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

  return manuscript.getView(data.id)
}

module.exports = submitManuscript
