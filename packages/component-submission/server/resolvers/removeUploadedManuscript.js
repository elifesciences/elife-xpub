const { Manuscript, User } = require('@elifesciences/component-model')
const logger = require('@pubsweet/logger')

async function removeUploadedManuscript(_, vars, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(vars.id, userUuid)

  const manuscriptUploadIndex = manuscript.files.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE',
  )

  if (manuscriptUploadIndex > -1) {
    manuscript.files.splice(manuscriptUploadIndex, 1)
    // TODO: Should we remove the content from S3 ???
    await manuscript.save()
    logger.debug(`Manuscript file removed`, {
      manuscriptId: vars.id,
      userId: userUuid,
    })
  }

  return manuscript
}

module.exports = removeUploadedManuscript
