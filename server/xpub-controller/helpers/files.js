const logger = require('@pubsweet/logger')
const FileModel = require('@elifesciences/xpub-model').File

module.exports = {
  validateFileSize: (fileSize, config) => {
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
    return {
      stream,
      fileEntity,
    }
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

  uploadFileToServer: async (stream, fileSize) =>
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

  extractFileTitle: async (
    config,
    scienceBeamApi,
    fileContent,
    filename,
    mimeType,
    manuscriptId,
  ) => {
    let title = ''
    try {
      // also send source file to conversion service
      title = await scienceBeamApi.extractSemantics(
        config,
        fileContent,
        filename,
        mimeType,
      )
    } catch (error) {
      let errorMessage = ''
      if (error.error.code === 'ETIMEDOUT' || error.error.connect === false) {
        errorMessage = 'Request to science beam timed out'
      } else {
        errorMessage = error.message
      }
      logger.warn('Manuscript conversion failed', {
        error: errorMessage,
        manuscriptId,
        filename,
      })
    }
    return title
  },
  cleanOldManuscript: async manuscript => {
    const oldFileIndex = manuscript.files.findIndex(
      element => element.type === 'MANUSCRIPT_SOURCE',
    )

    if (oldFileIndex >= 0) {
      logger.info(
        `Manuscript Upload found index ${oldFileIndex} ${
          manuscript.files[oldFileIndex].filename
        } | ${manuscript.id}`,
      )
      const oldFile = await FileModel.find(manuscript.files[oldFileIndex].id)
      manuscript.files.splice(oldFileIndex, 1)
      await oldFile.delete()
    }
  },
}
