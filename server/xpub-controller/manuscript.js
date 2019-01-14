const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const UserModel = require('@elifesciences/xpub-model').User
const Notification = require('./notification')

class Manuscript {
  constructor(config, user) {
    this.user = user
    this.config = config
  }

  async update(data) {
    const userUuid = await UserModel.getUuidForProfile(this.user)
    const manuscript = await ManuscriptModel.find(data.id, userUuid)
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
      userId: userUuid,
    })

    return manuscript
  }
}

module.exports = Manuscript
