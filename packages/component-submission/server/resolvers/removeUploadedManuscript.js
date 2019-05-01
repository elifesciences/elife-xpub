const config = require('config')
const User = require('@elifesciences/component-model-user').model
const FileModel = require('@elifesciences/component-model-file').model
const logger = require('@pubsweet/logger')
const { S3Storage } = require('@elifesciences/component-service-s3')
const { Manuscript } = require('../use-cases')

async function removeUploadedManuscript(_, vars, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const fileModels = (await FileModel.findByManuscriptId(vars.id)).filter(
    file => file.type === 'MANUSCRIPT_SOURCE',
  )

  if (fileModels.length > 0) {
    await fileModels[0].delete()

    logger.debug(`Manuscript file removed`, {
      manuscriptId: vars.id,
      userId: userUuid,
    })
  }

  const manuscript = new Manuscript(config, userUuid, S3Storage)

  return manuscript.getView(vars.id)
}

module.exports = removeUploadedManuscript
