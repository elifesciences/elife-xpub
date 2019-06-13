const config = require('config')
const Joi = require('joi')
const { omit } = require('lodash')
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

const runExport = (manuscriptModel, userUuid, ip) =>
  mecaExport(manuscriptModel, S3Storage.getContent, ip)
    .then(async () => {
      logger.info(`Manuscript ${manuscriptModel.id} successfully exported`)
      const notify = new Notification(config)
      await notify.sendFinalSubmissionEmail(manuscriptModel)
      await ManuscriptModel.updateStatus(
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

const submitManuscript = (_runExport = runExport) => async (
  _,
  { data },
  { user, ip },
) => {
  const userUuid = await User.getUuidForProfile(user)
  let manuscriptModel = await ManuscriptModel.find(data.id, userUuid)
  if (manuscriptModel.status !== ManuscriptModel.statuses.INITIAL) {
    throw new Error(
      `Cannot submit manuscript with status of ${manuscriptModel.status}`,
    )
  }

  const manuscriptInput = omit(
    ManuscriptModel.removeOptionalBlankReviewers(data),
    'lastStepVisited',
  )
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

  await manuscriptModel.saveGraph()

  if (manuscriptModel.fileStatus !== 'READY') {
    throw new Error('Manuscript fileStatus is CHANGING', {
      manuscriptId: manuscriptModel.id,
    })
  }

  manuscriptModel = await ManuscriptModel.updateStatus(
    manuscriptModel.id,
    ManuscriptModel.statuses.MECA_EXPORT_PENDING,
  )

  // This function can take a while so do not await this (apart from in tests)
  _runExport(manuscriptModel, userUuid, ip)

  const manuscript = new Manuscript(config, userUuid, S3Storage)

  return manuscript.getView(manuscriptModel.id)
}

module.exports = { submitManuscript, runExport }
