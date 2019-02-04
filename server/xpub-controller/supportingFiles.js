const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const FileModel = require('@elifesciences/xpub-model').File
const logger = require('@pubsweet/logger')

class SupportingFiles {
  constructor(storage, id, user) {
    this.storage = storage
    this.id = id
    this.user = user
  }

  async removeAll() {
    let manuscript = await ManuscriptModel.find(this.id, this.user)
    const filesWithoutSupporting = manuscript.files.filter(
      file => file.type !== 'SUPPORTING_FILE',
    )

    const files = await FileModel.findByManuscriptId(this.id)

    if (files && files.length > 0) {
      let modified = false
      files
        .filter(file => file.type === 'SUPPORTING_FILE')
        .forEach(async file => {
          try {
            modified = true
            await file.updateStatus('CANCELLED')
            await this.storage.deleteContent(file)
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

  async removeFile(manuscriptId, fileId) {
    let manuscript = await ManuscriptModel.find(this.id, this.user)
    const supportingFile = await FileModel.find(fileId)

    const filesWithoutSupporting = manuscript.files.filter(
      file => file.id !== fileId,
    )

    if (manuscript.id === manuscriptId) {
      await this.storage.deleteContent(supportingFile)
      await supportingFile.delete()
      logger.info(
        `supporing file ${fileId} deleted, manuscript ${manuscriptId}`,
      )
    } else {
      logger.error(
        `file ${fileId} does not belongs to manuscript ${manuscriptId}`,
      )
    }

    manuscript.files = filesWithoutSupporting
    manuscript = await manuscript.save()
    return manuscript
  }
}

module.exports = SupportingFiles
