const config = require('config')
const Joi = require('joi')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const { mecaExport } = require('@elifesciences/component-meca')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { S3Storage } = require('@elifesciences/component-service-s3')
const manuscriptInputSchema = require('../helpers/manuscriptInputValidationSchema')

const { Notification } = require('../services')

async function submitManuscript(_, { data }, { user, ip }) {
  const userUuid = await User.getUuidForProfile(user)
  let manuscript = await Manuscript.find(data.id, userUuid)
  logger
    .warn('manuscript beginning submit')
    .warn(
      JSON.stringify(
        _.pick(manuscript, ['id', 'files', 'fileStatus']),
        null,
        4,
      ),
    )

  if (manuscript.status !== Manuscript.statuses.INITIAL) {
    throw new Error(
      `Cannot submit manuscript with status of ${manuscript.status}`,
    )
  }

  const manuscriptInput = Manuscript.removeOptionalBlankReviewers(data)
  const { error: errorManuscript } = Joi.validate(
    manuscriptInput,
    manuscriptInputSchema,
  )
  if (errorManuscript) {
    logger.error(`Bad manuscript data: ${errorManuscript}`)
    throw new Error(errorManuscript)
  }

  manuscript.applyInput(manuscriptInput)

  const sourceFile = manuscript.getSource()
  if (!sourceFile) {
    throw new Error('Manuscript has no source file', {
      manuscriptId: manuscript.id,
    })
  }

  await manuscript.save()

  if (manuscript.fileStatus !== 'READY') {
    throw new Error('Manuscript fileStatus is CHANGING', {
      manuscriptId: manuscript.id,
    })
  }

  manuscript = await Manuscript.updateStatus(
    manuscript.id,
    Manuscript.statuses.MECA_EXPORT_PENDING,
  )

  await mecaExport(manuscript, S3Storage.getContent, ip)
    .then(async () => {
      logger.info(`Manuscript ${manuscript.id} successfully exported`)
      const notify = new Notification(config)
      await notify.sendFinalSubmissionEmail(manuscript)
      return Manuscript.updateStatus(
        manuscript.id,
        Manuscript.statuses.MECA_EXPORT_SUCCEEDED,
      )
    })
    .catch(async err => {
      logger.error('MECA export failed', err)
      await Manuscript.updateStatus(
        manuscript.id,
        Manuscript.statuses.MECA_EXPORT_FAILED,
      )
      return mailer.send({
        to: config.get('meca.email.recipient'),
        from: config.get('meca.email.sender'),
        subject: `${config.get('meca.email.subjectPrefix')}MECA export failed`,
        text: `Manuscript ID: ${manuscript.id}
Manuscript title: ${manuscript.meta.title}
Error:

${err}`,
      })
    })
    .catch(err => {
      logger.error('Error handling MECA export failure', err)
    })

  return manuscript
}

module.exports = submitManuscript
