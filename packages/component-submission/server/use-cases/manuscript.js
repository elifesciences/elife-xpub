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
      logger.error(`uploadManuscriptFile threw this error: ${error}`)
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

    return ManuscriptModel.find(manuscriptId, this.userId)
  }

  async update(data) {
    const manuscript = await ManuscriptModel.find(data.id, this.userId)
    if (manuscript.status !== ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${manuscript.status}`,
      )
    }

    manuscript.applyInput(data)

    try {
      // In the case of auto-save this can be expected to fail when
      // there is also another operation (file upload or submit) in progress
      await manuscript.save()
    } catch (error) {
      const expected = 'Data Integrity Error'
      if (error.message.startsWith(expected)) {
        logger.error(`Expected a ${expected}, ${error.message}`)
      } else {
        // not an error we were expecting.
        throw error
      }
    }

    logger.debug(`Updated manuscript`, {
      manuscriptId: data.id,
      userId: this.userId,
    })

    return manuscript
  }
}

module.exports = Manuscript
