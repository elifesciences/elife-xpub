const config = require('config')
const FileModel = require('@elifesciences/component-model-file').model
const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model
const logger = require('@pubsweet/logger')
const Manuscript = require('./manuscript')

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
    await fileEntity.saveGraph()
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
    const manuscript = new Manuscript(config, this.userId, this.storage)

    // we need to do a find to make sure the user has access
    await ManuscriptModel.find(this.manuscriptId, this.userId)

    const files = await FileModel.findByManuscriptId(this.manuscriptId)

    if (files && files.length > 0) {
      await Promise.all(
        files
          .filter(file => file.type === 'SUPPORTING_FILE')
          .map(async file => {
            try {
              await file.updateStatus('CANCELLED')
              await this.storage.deleteContent(file)
              await file.delete()
            } catch (err) {
              logger.error(`Unable to delete file ${file.id}`, err)
            }
          }),
      )
    }

    return manuscript.getView(this.manuscriptId)
  }
}

module.exports = SupportingFiles
