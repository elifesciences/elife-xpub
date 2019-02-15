const logger = require('@pubsweet/logger')
const FilesHelper = require('./files')
const FileModel = require('@elifesciences/xpub-model').File
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript

class ManuscriptHelper {
  constructor(config, userId, storage, filesHelper) {
    this.userId = userId
    this.config = config
    this.storage = storage
    this.filesHelper = filesHelper
  }

  async uploadManuscriptFile(fileData, fileSize, manuscriptId, progress) {
    return new Promise(async (resolve, reject) => {
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
        FilesHelper.endFileProgress(progress)
        return reject(err)
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
      return resolve(manuscript)
    })
  }
}

module.exports = ManuscriptHelper
