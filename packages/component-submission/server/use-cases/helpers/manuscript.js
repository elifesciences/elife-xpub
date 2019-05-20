const logger = require('@pubsweet/logger')
const { File, Manuscript } = require('@pubsweet/models')
const FilesHelper = require('./files')

class ManuscriptHelper {
  constructor(config, userId, storage, filesHelper) {
    this.userId = userId
    this.config = config
    this.storage = storage
    this.filesHelper = filesHelper
  }

  static async clearPendingFile(manuscript) {
    const pendingFileIndex = manuscript.files.findIndex(
      element => element.type === 'MANUSCRIPT_SOURCE_PENDING',
    )

    if (pendingFileIndex >= 0) {
      logger.info(`clearPendingFile required on ${manuscript.id}`)
      const pendingFile = await File.find(manuscript.files[pendingFileIndex].id)
      await pendingFile.delete()
      logger.info(
        `Pending file removed ${pendingFileIndex} ${
          manuscript.files[pendingFileIndex].filename
        } | ${manuscript.id}`,
      )
    }
  }

  async uploadManuscriptFile(fileData, fileSize, manuscriptId, predictor) {
    const { stream } = fileData
    let { fileEntity } = fileData
    const { id: fileId, filename, mimeType } = fileEntity

    logger.info(
      `Manuscript Upload Size: ${filename}, ${fileSize} | ${manuscriptId}`,
    )

    logger.info(`uploadFileToServer::start ${filename} | ${manuscriptId}`)
    const fileContent = await FilesHelper.uploadFileToServer(
      stream,
      fileSize,
      predictor,
    )

    fileEntity = await File.find(fileId)
    await fileEntity.updateStatus('UPLOADED')

    logger.info(`uploadFileToServer::end ${filename} | ${manuscriptId}`)

    logger.info(`S3.putContent::start ${filename} | ${manuscriptId}`)

    fileEntity = await File.find(fileId)

    try {
      await this.storage.putContent(fileEntity, fileContent, {
        size: fileSize,
      })
      await fileEntity.updateStatus('STORED')
    } catch (err) {
      logger.error(`S3.putContent::start ${err} | ${manuscriptId}`)
      await fileEntity.delete()
      throw err
    }

    logger.info(`S3.putContent::end ${filename} | ${manuscriptId}`)

    const title = await this.filesHelper.extractFileTitle(
      fileContent,
      filename,
      mimeType,
      manuscriptId,
    )

    try {
      let manuscript = await Manuscript.find(manuscriptId, this.userId)

      await FilesHelper.swapPendingToSource(manuscript.files)

      manuscript.files.forEach(file =>
        logger.info(`New Files: ${file.id} | ${file.type}`),
      )

      manuscript = await Manuscript.find(manuscriptId, this.userId)
      manuscript.meta.title = title
      await manuscript.save()

      if (!FilesHelper.validateManuscriptSource(manuscript.files)) {
        throw new Error(`Validation Failure on ${manuscript.id}`)
      }
    } catch (error) {
      logger.error(`Error during final update: ${error}`)
      throw error
    }

    logger.info(`Manuscript Upload::saved ${title} | ${manuscriptId}`)
  }
}

module.exports = ManuscriptHelper
