const { Manuscript, User } = require('@elifesciences/xpub-model')
const logger = require('@pubsweet/logger')
const { S3File } = require('@elifesciences/xpub-server')

async function removeSupportingFiles(_, id, user) {
  return interfaceRemoveSupportingFiles(S3File, id, user)
}

async function interfaceRemoveSupportingFiles(storage, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  let manuscript = await Manuscript.find(id, userUuid)

  const filesWithoutSupporting = manuscript.files.filter(
    file => file.type !== 'SUPPORTING_FILE',
  )

  const files = await storage.findByManuscriptId(id)

  if (files && files.length > 0) {
    let modified = false
    files
      .filter(file => file.type === 'SUPPORTING_FILE')
      .forEach(async file => {
        try {
          modified = true
          await file.deleteContent()
          await file.delete()
        } catch (err) {
          logger.error(`Unable to delete file ${file.id}`, err)
        }
      })
    if (modified) {
      manuscript.files = filesWithoutSupporting
      manuscript = await manuscript.save()
    }
  }

  return manuscript
}

module.exports = {
  removeSupportingFiles,
  interfaceRemoveSupportingFiles,
}
