const config = require('config')
const FileModel = require('@elifesciences/xpub-model').File

module.exports = {
  validateFileSize: fileSize => {
    if (fileSize > config.get('fileUpload.maxSizeMB') * 1e6) {
      throw new Error(
        `File size shouldn't exceed ${config.get('fileUpload.maxSizeMB')}MB`,
      )
    }
  },

  generateFileEntity: async (file, manuscriptId) => {
    const { stream, filename, mimetype: mimeType } = await file

    const fileEntity = await new FileModel({
      manuscriptId,
      url: `manuscripts/${manuscriptId}`,
      filename,
      type: 'MANUSCRIPT_SOURCE_PENDING',
      mimeType,
    }).save()
    return { stream, fileEntity }
  },
}
