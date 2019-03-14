const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const Notification = require('./notification')
const { FilesHelper, ManuscriptHelper } = require('./helpers')

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

    // ensure user can view manuscript
    await ManuscriptModel.find(manuscriptId, this.userId)

    const fileData = await FilesHelper.getFileData(file, manuscriptId)

    const pubsub = await this.pubsubManager.getPubsub()

    // Predict upload time - The analysis was done on #839
    const predictedTime = 5 + 4.67e-6 * fileSize
    const startedTime = Date.now()
    const progress = FilesHelper.startFileProgress(
      pubsub,
      ON_UPLOAD_PROGRESS,
      startedTime,
      predictedTime,
      manuscriptId,
      200,
    )
    try {
      await this.manuscriptHelper.uploadManuscriptFile(
        fileData,
        fileSize,
        manuscriptId,
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
      `Manuscript Upload Time, Actual (${actualTime}) , Predicted (${predictedTime}) | ${manuscriptId}`,
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

    if (data.submitterSignature) {
      const notify = new Notification(this.config, manuscript.getAuthor())
      notify.sendFinalSubmissionEmail()
    }
    manuscript.applyInput(data)

    await manuscript.save()
    logger.debug(`Updated manuscript`, {
      manuscriptId: data.id,
      userId: this.userId,
    })

    return manuscript
  }
}

module.exports = Manuscript
