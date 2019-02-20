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
    const manuscript = await ManuscriptModel.find(manuscriptId, this.userId)

    const fileData = await FilesHelper.generateFileEntity(file, manuscriptId)

    const pubsub = await this.pubsubManager.getPubsub()

    // Predict upload time - The analysis was done on #839
    const predictedTime = 5 + 4.67e-6 * fileSize
    const startedTime = Date.now()
    const progress = setInterval(
      FilesHelper.publishPredictedProgress(
        pubsub,
        ON_UPLOAD_PROGRESS,
        startedTime,
        predictedTime,
        manuscriptId,
      ),
      200,
    )

    try {
      await this.manuscriptHelper.uploadManuscriptFile(
        pubsub,
        ON_UPLOAD_PROGRESS,
        fileData,
        fileSize,
        manuscript.id,
        progress,
      )
    } catch (error) {
      FilesHelper.endFileProgress(
        pubsub,
        ON_UPLOAD_PROGRESS,
        progress,
        manuscriptId,
      )
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
