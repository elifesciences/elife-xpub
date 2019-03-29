const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model
const FileModel = require('@elifesciences/component-model-file')
const logger = require('@pubsweet/logger')

class SupportingFiles {
  constructor(storage, manuscriptId, userId) {
    this.storage = storage
    this.manuscriptId = manuscriptId
    this.userId = userId
  }

  async upload(file) {
    const { stream, filename, mimetype: mimeType } = await file
    let fileEntity = new FileModel({
      manuscriptId: this.manuscriptId,
      url: `supporting/${this.manuscriptId}`,
      filename,
      type: 'SUPPORTING_FILE',
      mimeType,
    })
    await fileEntity.save()
    const fileId = fileEntity.id

    const fileContents = await new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', chunk => {
        chunks.push(chunk)
      })
      stream.on('error', reject)
      stream.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })
    await fileEntity.updateStatus('UPLOADED')
    fileEntity = await FileModel.find(fileId)

    try {
      await this.storage.putContent(fileEntity, fileContents, {})
      await fileEntity.updateStatus('STORED')
    } catch (err) {
      await fileEntity.updateStatus('CANCELLED')
      await fileEntity.delete()
      throw err
    }

    return fileEntity
  }

  async removeAll() {
    let manuscript = await ManuscriptModel.find(this.manuscriptId, this.userId)
    const filesWithoutSupporting = manuscript.files.filter(
      file => file.type !== 'SUPPORTING_FILE',
    )

    const files = await FileModel.findByManuscriptId(this.manuscriptId)

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
}

module.exports = SupportingFiles
