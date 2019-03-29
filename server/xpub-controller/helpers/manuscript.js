const logger = require('@pubsweet/logger')
const FilesHelper = require('./files')
const FileModel = require('@elifesciences/component-model-file')
const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model

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
      const pendingFile = await FileModel.find(
        manuscript.files[pendingFileIndex].id,
      )
      await pendingFile.delete()
      logger.info(
        `Pending file removed ${pendingFileIndex} ${
          manuscript.files[pendingFileIndex].filename
        } | ${manuscript.id}`,
      )
    }
  }

  async uploadManuscriptFile(fileData, fileSize, manuscriptId) {
    const { stream } = fileData
    let { fileEntity } = fileData
    const { id: fileId, filename, mimeType } = fileEntity

    logger.info(
      `Manuscript Upload Size: ${filename}, ${fileSize} | ${manuscriptId}`,
    )

    logger.info(
      `Manuscript Upload fileContents::start ${filename} | ${manuscriptId}`,
    )
    const fileContent = await FilesHelper.uploadFileToServer(stream, fileSize)

    fileEntity = await FileModel.find(fileId)
    await fileEntity.updateStatus('UPLOADED')

    logger.info(
      `Manuscript Upload fileContents::end ${filename} | ${manuscriptId}`,
    )

    logger.info(`Manuscript Upload S3::start ${filename} | ${manuscriptId}`)

    fileEntity = await FileModel.find(fileId)

    try {
      await this.storage.putContent(fileEntity, fileContent, {
        size: fileSize,
      })
      await fileEntity.updateStatus('STORED')
    } catch (err) {
      logger.error(
        `Manuscript was not uploaded to S3: ${err} | ${manuscriptId}`,
      )
      await fileEntity.delete()
      throw err
    }

    logger.info(`Manuscript Upload S3::end ${filename} | ${manuscriptId}`)

    const title = await this.filesHelper.extractFileTitle(
      fileContent,
      filename,
      mimeType,
      manuscriptId,
    )
    let manuscript = await ManuscriptModel.find(manuscriptId, this.userId)
    FilesHelper.cleanOldManuscript(manuscript)

    manuscript = await FilesHelper.setManuscriptMetadata(manuscript, title)

    FilesHelper.validateManuscriptSource(manuscript)

    logger.info(
      `Manuscript Upload Manuscript::saved ${
        manuscript.meta.title
      } | ${manuscriptId}`,
    )
  }
}

module.exports = ManuscriptHelper
