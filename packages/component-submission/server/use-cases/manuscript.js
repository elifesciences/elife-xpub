const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/component-model-manuscript')
  .model
const { UploadPredictor, FilesHelper, ManuscriptHelper } = require('./helpers')

class Manuscript {
  constructor(config, user, storage, scienceBeamApi, pubsubManager) {
    this.userId = user
    this.config = config
    this.storage = storage
    this.scienceBeamApi = scienceBeamApi
    this.pubsubManager = pubsubManager
    this.filesHelper = new FilesHelper(this.config, this.scienceBeamApi)
    this.manuscriptHelper = new ManuscriptHelper(
      this.config,
      this.userId,
      this.storage,
      this.filesHelper,
    )
  }

  async upload(manuscriptId, file, fileSize) {
    const { ON_UPLOAD_PROGRESS } = this.pubsubManager.asyncIterators

    this.filesHelper.validateFileSize(fileSize)
    const predictor = new UploadPredictor(fileSize)

    // ensure user can view manuscript
    await ManuscriptModel.find(manuscriptId, this.userId)

    const fileData = await FilesHelper.getFileData(file, manuscriptId)

    const pubsub = await this.pubsubManager.getPubsub()

    const startedTime = Date.now()
    const progress = FilesHelper.startFileProgress(
      pubsub,
      ON_UPLOAD_PROGRESS,
      startedTime,
      predictor,
      manuscriptId,
      200,
    )
    try {
      await this.manuscriptHelper.uploadManuscriptFile(
        fileData,
        fileSize,
        manuscriptId,
        predictor,
      )
    } catch (error) {
      FilesHelper.endFileProgress(
        pubsub,
        ON_UPLOAD_PROGRESS,
        progress,
        manuscriptId,
      )
      const manuscript = await ManuscriptModel.find(manuscriptId, this.userId)
      await ManuscriptHelper.clearPendingFile(manuscript)
      throw error
    }

    FilesHelper.endFileProgress(
      pubsub,
      ON_UPLOAD_PROGRESS,
      progress,
      manuscriptId,
    )

    const actualTime = (Date.now() - startedTime) / 1000
    logger.info(
      `Manuscript Upload Time, Actual (${actualTime}) , Predicted (${predictor.getPredictedTime()}) | ${manuscriptId}`,
    )

    return this.getView(manuscriptId)
  }

  async update(data) {
    const manuscript = await ManuscriptModel.find(data.id, this.userId)
    if (manuscript.status !== ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${manuscript.status}`,
      )
    }

    manuscript.applyInput(data)

    await manuscript.save()
    logger.debug(`Updated manuscript`, {
      manuscriptId: data.id,
      userId: this.userId,
    })

    return this.getView(data.id)
  }

  async getView(manuscriptId) {
    const manuscript = await ManuscriptModel.find(manuscriptId, this.userId)

    // eslint-disable-next-line no-restricted-syntax
    for (const file of manuscript.files) {
      // eslint-disable-next-line no-param-reassign
      file.downloadLink = this.storage.getDownloadLink(file)
    }

    return manuscript
  }
}

module.exports = Manuscript
