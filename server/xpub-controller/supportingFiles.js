const { File, Manuscript } = require('@elifesciences/xpub-model')
const logger = require('@pubsweet/logger')

class SupportingFiles {
  static async remove(storage, _, { id }, { user }) {
    let manuscript = await Manuscript.find(id, user)

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
            await storage.deleteContent(file)
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
}

module.exports = SupportingFiles
