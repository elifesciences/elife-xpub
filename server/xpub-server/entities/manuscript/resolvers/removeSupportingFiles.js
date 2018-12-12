const { Manuscript, User } = require('@elifesciences/xpub-model')
const logger = require('@pubsweet/logger')
const { File } = require('@elifesciences/xpub-model')
const { S3Storage } = require('@elifesciences/xpub-server')

async function removeSupportingFiles(_, id, user) {
  const userUuid = await User.getUuidForProfile(user)
  let manuscript = await Manuscript.find(id, userUuid)

  const filesWithoutSupporting = manuscript.files.filter(
    file => file.type !== 'SUPPORTING_FILE',
  )

  const files = await File.findByManuscriptId(id)

  if (files && files.length > 0) {
    let modified = false
    files
      .filter(file => file.type === 'SUPPORTING_FILE')
      .forEach(async file => {
        try {
          modified = true
          await S3Storage.deleteContent(file)
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

module.exports = removeSupportingFiles
