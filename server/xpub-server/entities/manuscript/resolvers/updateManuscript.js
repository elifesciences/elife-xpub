const pug = require('pug')
const config = require('config')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')

const { ManuscriptManager, UserManager } = require('@elifesciences/xpub-model')

async function updateManuscript(_, { data }, { user }) {
  const userUuid = await UserManager.getUuidForProfile(user)
  const originalManuscript = await ManuscriptManager.find(data.id, userUuid)
  if (originalManuscript.status !== ManuscriptManager.statuses.INITIAL) {
    throw new Error(
      `Cannot update manuscript with status of ${originalManuscript.status}`,
    )
  }

  const originalAuthorEmails = originalManuscript
    ? ManuscriptManager.getAuthor(originalManuscript)
    : [].map(author => author.alias.email).join(',')

  const manuscript = ManuscriptManager.applyInput(originalManuscript, data)

  const newAuthors = ManuscriptManager.getAuthor(manuscript)
  const newAuthorEmails = newAuthors
    .map(author => author.alias.email)
    .join(',')

  // Send email here only when author changes...
  if (newAuthorEmails !== originalAuthorEmails) {
    const textCompile = pug.compileFile(
      'templates/dashboard-email-text.pug',
    )
    const htmlCompile = pug.compileFile(
      'templates/dashboard-email-html.pug',
    )
    const text = textCompile({
      authorName: newAuthors[0].alias.firstName,
      linkDashboard: config.pubsweet.base_url,
    })
    const html = htmlCompile({
      authorName: newAuthors[0].alias.firstName,
      linkDashboard: config.pubsweet.base_url,
    })

    mailer
      .send({
        to: newAuthorEmails,
        subject: 'Libero Submission System: New Submission',
        from: 'editorial@elifesciences.org',
        text,
        html,
      })
      .catch(err => {
        logger.error(
          `Error sending corresponding author confirmation email: ${err}`,
        )
      })
  }

  await ManuscriptManager.save(manuscript)
  logger.debug(`Updated manuscript`, {
    manuscriptId: data.id,
    userId: userUuid,
  })

  return manuscript
}

module.exports = updateManuscript
