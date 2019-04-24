const config = require('config')
const User = require('@elifesciences/component-model-user').model
const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model
const logger = require('@pubsweet/logger')
const { S3Storage } = require('@elifesciences/component-service-s3')
const { Manuscript } = require('../use-cases')

async function removeUploadedManuscript(_, vars, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscriptModel = await ManuscriptModel.find(vars.id, userUuid)

  const manuscriptUploadIndex = manuscriptModel.files.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE',
  )

  if (manuscriptUploadIndex > -1) {
    manuscriptModel.files.splice(manuscriptUploadIndex, 1)
    // TODO: Should we remove the content from S3 ???
    await manuscriptModel.save()
    logger.debug(`Manuscript file removed`, {
      manuscriptId: vars.id,
      userId: userUuid,
    })
  }

  const manuscript = new Manuscript(config, userUuid, S3Storage)

  return manuscript.getView(vars.id)
}

module.exports = removeUploadedManuscript
