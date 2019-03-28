const logger = require('@pubsweet/logger')
const FileModel = require('@elifesciences/component-model').File
const SemanticExtractionModel = require('@elifesciences/component-model')
  .SemanticExtraction

class FilesHelper {
  constructor(config, scienceBeamApi) {
    this.config = config
    this.scienceBeamApi = scienceBeamApi
  }

  validateFileSize(fileSize) {
    if (fileSize > this.config.get('fileUpload.maxSizeMB') * 1e6) {
      throw new Error(
        `File size shouldn't exceed ${this.config.get(
          'fileUpload.maxSizeMB',
        )}MB`,
      )
    }
  }

  static async getFileData(file, manuscriptId) {
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
  }

  static publishPredictedProgress(
    pubsub,
    ON_UPLOAD_PROGRESS,
    startedTime,
    predictor,
    manuscriptId,
  ) {
    const prediction = predictor.getPredictedTime()
    if (manuscriptId.length === 36 && prediction > 0) {
      return () => {
        const elapsed = Date.now() - startedTime
        let progress = parseInt((100 * elapsed) / 1000 / prediction, 10)
        // don't let the prediction complete the upload
        if (progress > 99) progress = 99
        pubsub.publish(`${ON_UPLOAD_PROGRESS}.${manuscriptId}`, {
          manuscriptUploadProgress: progress,
        })
      }
    }
    throw new Error('Invalid parameters to calculate the upload file progress.')
  }

  static startFileProgress(
    pubsub,
    ON_UPLOAD_PROGRESS,
    startedTime,
    predictor,
    manuscriptId,
    interval,
  ) {
    return setInterval(
      FilesHelper.publishPredictedProgress(
        pubsub,
        ON_UPLOAD_PROGRESS,
        startedTime,
        predictor,
        manuscriptId,
      ),
      interval,
    )
  }

  static endFileProgress(pubsub, ON_UPLOAD_PROGRESS, progress, manuscriptId) {
    pubsub.publish(`${ON_UPLOAD_PROGRESS}.${manuscriptId}`, {
      manuscriptUploadProgress: 100,
    })
    return clearInterval(progress)
  }

  static async uploadFileToServer(stream, fileSize) {
    return new Promise((resolve, reject) => {
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
    })
  }

  async extractFileTitle(fileContent, filename, mimeType, manuscriptId) {
    let title = ''
    try {
      // also send source file to conversion service
      title = await this.scienceBeamApi.extractSemantics(
        this.config,
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

    const semanticExtractionEntity = SemanticExtractionModel.createTitleEntity(
      manuscriptId,
      title,
    )
    await semanticExtractionEntity.save()

    return title
  }

  static async cleanOldManuscript(manuscript) {
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
  }

  static async setManuscriptMetadata(initialManuscript, title) {
    return new Promise(async resolve => {
      const manuscript = initialManuscript
      const pendingFileIndex = manuscript.files.findIndex(
        element => element.type === 'MANUSCRIPT_SOURCE_PENDING',
      )
      manuscript.files[pendingFileIndex].type = 'MANUSCRIPT_SOURCE'
      logger.info(
        `Manuscript Upload Manuscript::save ${title} | ${manuscript.id}`,
      )
      manuscript.meta.title = title
      await manuscript.save()
      resolve(manuscript)
    })
  }

  static validateManuscriptSource(manuscript) {
    const sourceList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE',
    )
    const pendingList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE_PENDING',
    )
    if (sourceList.length !== 1 || pendingList.length !== 0) {
      logger.error(`Validation failed ${JSON.stringify(manuscript, null, 4)}`)
      throw new Error(`Validation Failure on ${manuscript.id}`)
    }
  }
}

module.exports = FilesHelper
