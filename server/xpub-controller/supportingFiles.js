const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const FileModel = require('@elifesciences/xpub-model').File
const logger = require('@pubsweet/logger')

class SupportingFiles {
  constructor(storage, manuscriptId, user) {
    this.storage = storage
    this.manuscriptId = manuscriptId
    this.user = user
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
    let manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
    await manuscript.validate()
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
    // *unnessicary entity .find()'s after here are required while we are using base-model v1.1.0
    manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
    await manuscript.validate()
    fileEntity = await FileModel.find(fileId)

    try {
      await this.storage.putContent(fileEntity, fileContents, {})
      await fileEntity.updateStatus('STORED')
      manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
      await manuscript.validate()
    } catch (err) {
      await fileEntity.updateStatus('CANCELLED')
      manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
      await manuscript.validate()
      await fileEntity.delete()
      throw err
    }

    return fileEntity
  }

  async removeAll() {
    let manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
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
        // Required due to pubsweet base-model v1.1.0
        manuscript = await ManuscriptModel.find(this.manuscriptId, this.user)
        await manuscript.validate()
      }
    }

    return manuscript
  }
}

module.exports = SupportingFiles
