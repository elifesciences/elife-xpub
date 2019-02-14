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
  startFileProgress: (
    pubsub,
    ON_UPLOAD_PROGRESS,
    startedTime,
    predictedTime,
    manuscriptId,
  ) =>
    setInterval(() => {
      const elapsed = Date.now() - startedTime
      let progress = parseInt((100 * elapsed) / 1000 / predictedTime, 10)
      // don't let the prediction complete the upload
      if (progress > 99) progress = 99
      pubsub.publish(`${ON_UPLOAD_PROGRESS}.${manuscriptId}`, {
        manuscriptUploadProgress: progress,
      })
    }, 200),
  endFileProgress: progress => clearInterval(progress),
  uploadFileToServer: async (stream, fileSize, logger) =>
    new Promise((resolve, reject) => {
      let uploadedSize = 0
      const chunks = []
      stream.on('data', chunk => {
        uploadedSize += chunk.length
        chunks.push(chunk)
      })
      stream.on('error', reject)
      stream.on('end', () => {
        resolve(Buffer.concat(chunks))
        if (uploadedSize !== fileSize) {
          logger.warn(
            'Reported file size for manuscript is different than the actual file size',
          )
        }
      })
    }),
}
