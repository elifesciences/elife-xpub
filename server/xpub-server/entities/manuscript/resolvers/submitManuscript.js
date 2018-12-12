const config = require('config')
const Joi = require('joi')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const { mecaExport } = require('@elifesciences/xpub-meca-export')
const { Manuscript, User } = require('@elifesciences/xpub-model')
const { S3Storage } = require('@elifesciences/xpub-server')
const manuscriptInputSchema = require('../helpers/manuscriptInputValidationSchema')

async function submitManuscript(_, { data }, { user, ip }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(data.id, userUuid)
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

  manuscript.status = Manuscript.statuses.MECA_EXPORT_PENDING
  await manuscript.save()

  const content = await S3Storage.getContent(sourceFile)
  mecaExport(manuscript, content, ip)
    .then(() => {
      logger.info(`Manuscript ${manuscript.id} successfully exported`)
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
        to: config.get('meca.notificationEmail'),
        subject: 'MECA export failed',
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
