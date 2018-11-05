const config = require('config')
const Joi = require('joi')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const { mecaExport } = require('@elifesciences/xpub-meca-export')
const {
  ManuscriptManager,
  FileManager,
  UserManager,
} = require('@elifesciences/xpub-model')
const manuscriptInputSchema = require('../helpers/manuscriptInputValidationSchema')

async function submitManuscript(_, { data }, { user, ip }) {
  const userUuid = await UserManager.getUuidForProfile(user)
  const originalManuscript = await ManuscriptManager.find(data.id, userUuid)
  if (originalManuscript.status !== ManuscriptManager.statuses.INITIAL) {
    throw new Error(
      `Cannot submit manuscript with status of ${originalManuscript.status}`,
    )
  }

  const manuscriptInput = ManuscriptManager.removeOptionalBlankReviewers(data)
  const { error: errorManuscript } = Joi.validate(
    manuscriptInput,
    manuscriptInputSchema,
  )
  if (errorManuscript) {
    logger.error(`Bad manuscript data: ${errorManuscript}`)
    throw new Error(errorManuscript)
  }

  const manuscript = ManuscriptManager.applyInput(
    originalManuscript,
    manuscriptInput,
  )

  manuscript.status = ManuscriptManager.statuses.MECA_EXPORT_PENDING
  await ManuscriptManager.save(manuscript)

  const sourceFile = ManuscriptManager.getSource(manuscript)
  const content = await FileManager.getContent(sourceFile)
  mecaExport(manuscript, content, ip)
    .then(() => {
      logger.info(`Manuscript ${manuscript.id} successfully exported`)
      return ManuscriptManager.save({
        id: manuscript.id,
        status: ManuscriptManager.statuses.MECA_EXPORT_SUCCEEDED,
      })
    })
    .catch(async err => {
      logger.error('MECA export failed', err)
      await ManuscriptManager.save({
        id: manuscript.id,
        status: ManuscriptManager.statuses.MECA_EXPORT_FAILED,
      })
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
