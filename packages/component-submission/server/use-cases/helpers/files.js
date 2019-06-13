const logger = require('@pubsweet/logger')
const FileModel = require('@elifesciences/component-model-file').model
const SemanticExtractionModel = require('@elifesciences/component-model-semantic-extraction')
  .model

const cleanOldManuscript = async fileList => {
  const oldFileIndex = fileList.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE',
  )

  if (oldFileIndex >= 0) {
    logger.info(
      `Manuscript old index ${fileList[oldFileIndex].id} | ${
        fileList[oldFileIndex].filename
      }`,
    )
    const oldFile = await FileModel.find(fileList[oldFileIndex].id)
    await oldFile.delete()
    logger.info(`cleanOldManiscript now done`)
  }
}

const setPendingToSource = async fileList =>
  new Promise(async resolve => {
    const pendingFileIndex = fileList.findIndex(
      element => element.type === 'MANUSCRIPT_SOURCE_PENDING',
    )
    const newFile = await FileModel.find(fileList[pendingFileIndex].id)
    newFile.type = 'MANUSCRIPT_SOURCE'
    await newFile.saveGraph()
    logger.info(`Manuscript new index ${newFile.id} | ${newFile.filename}`)
    resolve(newFile)
  })

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
    }).saveGraph()
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
    if (manuscriptId.length === 36 && predictor.getPredictedTime() > 0) {
      return () => {
        const elapsed = Date.now() - startedTime
        const prediction = predictor.getPredictedTime()
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

  static async uploadFileToServer(stream, fileSize, predictor) {
    predictor.startSeconds(Date.now() / 1000)
    return new Promise((resolve, reject) => {
      let uploadedSize = 0
      const chunks = []
      stream.on('data', chunk => {
        uploadedSize += chunk.length
        chunks.push(chunk)
        predictor.updateSeconds(Date.now() / 1000, uploadedSize)
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
      const semanticExtractionEntity = SemanticExtractionModel.createTitleEntity(
        manuscriptId,
        title,
      )
      await semanticExtractionEntity.saveGraph()
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
  }

  static async swapPendingToSource(fileList) {
    await cleanOldManuscript(fileList)
    return setPendingToSource(fileList)
  }

  static validateManuscriptSource(fileList) {
    const sourceList = fileList.filter(f => f.type === 'MANUSCRIPT_SOURCE')
    const pendingList = fileList.filter(
      f => f.type === 'MANUSCRIPT_SOURCE_PENDING',
    )

    const valid = sourceList.length === 1 && pendingList.length === 0
    if (!valid) {
      logger.error(
        `Validation failed: sourceList ${JSON.stringify(sourceList, null, 4)}`,
      )
      logger.error(
        `Validation failed: pendingList ${JSON.stringify(
          pendingList,
          null,
          4,
        )}`,
      )
    }
    return valid
  }
}

module.exports = FilesHelper
