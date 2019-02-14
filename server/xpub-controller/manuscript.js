const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const FileModel = require('@elifesciences/xpub-model').File

const Notification = require('./notification')
const {
  validateFileSize,
  generateFileEntity,
  startFileProgress,
  endFileProgress,
  uploadFileToServer,
  extractFileTitle,
  cleanOldManuscript,
  setManuscriptMetadata,
} = require('./helpers/files')

class Manuscript {
  constructor(config, user, storage, scienceBeamApi, pubsubManager) {
    this.userId = user
    this.config = config
    this.storage = storage
    this.scienceBeamApi = scienceBeamApi
    this.pubsubManager = pubsubManager
  }

  async upload(manuscriptId, file, fileSize) {
    const { ON_UPLOAD_PROGRESS } = this.pubsubManager.asyncIterators

    validateFileSize(fileSize, this.config)

    // ensure user can view manuscript
    let manuscript = await ManuscriptModel.find(manuscriptId, this.userId)

    const fileData = await generateFileEntity(file, manuscriptId)
    const { stream } = fileData
    let { fileEntity } = fileData
    const { id: fileId, filename, mimeType } = fileEntity

    logger.info(
      `Manuscript Upload Size: ${filename}, ${fileSize} | ${manuscriptId}`,
    )

    const pubsub = await this.pubsubManager.getPubsub()

    // Predict upload time - The analysis was done on #839
    const predictedTime = 5 + 4.67e-6 * fileSize
    const startedTime = Date.now()
    const progress = startFileProgress(
      pubsub,
      ON_UPLOAD_PROGRESS,
      startedTime,
      predictedTime,
      manuscriptId,
    )

    logger.info(
      `Manuscript Upload fileContents::start ${filename} | ${manuscriptId}`,
    )

    const fileContent = await uploadFileToServer(stream, fileSize)

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
      await fileEntity.updateStatus('CANCELLED')
      await fileEntity.delete()
      endFileProgress(progress)
      throw err
    }

    logger.info(`Manuscript Upload S3::end ${filename} | ${manuscriptId}`)

    const title = await extractFileTitle(
      this.config,
      this.scienceBeamApi,
      fileContent,
      filename,
      mimeType,
      manuscriptId,
    )
    manuscript = await ManuscriptModel.find(manuscriptId, this.userId)
    cleanOldManuscript(manuscript)

    manuscript = await setManuscriptMetadata(manuscript, title)

    const sourceList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE',
    )
    const pendingList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE_PENDING',
    )

    // -->
    if (sourceList.length !== 1 || pendingList.length !== 0) {
      logger.error(`Validation failed ${JSON.stringify(manuscript, null, 4)}`)
      throw new Error(`Validation Failure on ${manuscript.id}`)
    }
    // <--

    logger.info(
      `Manuscript Upload Manuscript::saved ${
        manuscript.meta.title
      } | ${manuscriptId}`,
    )

    endFileProgress(progress)
    pubsub.publish(`${ON_UPLOAD_PROGRESS}.${manuscriptId}`, {
      manuscriptUploadProgress: 100,
    })

    // -->
    const actualTime = (Date.now() - startedTime) / 1000
    logger.info(
      `Manuscript Upload Time, Actual (${actualTime}) , Predicted (${predictedTime}) | ${manuscriptId}`,
    )
    // <--

    return ManuscriptModel.find(manuscriptId, this.userId)
  }

  async update(data) {
    const manuscript = await ManuscriptModel.find(data.id, this.userId)
    if (manuscript.status !== ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${manuscript.status}`,
      )
    }

    const originalEmails = (manuscript.getAuthor()
      ? manuscript.getAuthor()
      : []
    )
      .map(author => author.alias.email)
      .join(',')

    manuscript.applyInput(data)

    const newAuthors = manuscript.getAuthor()
    const newEmails = newAuthors.map(author => author.alias.email).join(',')

    // Send email here only when author changes...
    if (newEmails !== originalEmails) {
      // sendEmail
      const notify = new Notification(this.config, newAuthors)
      notify.sendDashboardEmail()
    }

    await manuscript.save()
    logger.debug(`Updated manuscript`, {
      manuscriptId: data.id,
      userId: this.userId,
    })

    return manuscript
  }
}

module.exports = Manuscript
