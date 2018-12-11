const { Manuscript, File, User } = require('@elifesciences/xpub-model')
const logger = require('@pubsweet/logger')

async function removeSupportingFiles(_, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(id, userUuid)

  const filesWithoutSupporting = manuscript.files.filter(
    file => file.type !== 'SUPPORTING_FILE',
  )

  const files = await File.findByManuscriptId(id)

  if (files) {
    files
      .filter(file => file.type === 'SUPPORTING_FILE')
      .forEach(async file => {
        try {
          await file.deleteContent()
          await file.delete()
        } catch (err) {
          logger.error(`Unable to delete file ${file.id}`, err)
        }
      })
  }
  return manuscript
}

module.exports = removeSupportingFiles
