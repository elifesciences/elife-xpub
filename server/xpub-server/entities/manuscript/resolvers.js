const config = require('config')
const pug = require('pug')
const {
  getPubsub,
  asyncIterators,
} = require('pubsweet-server/src/graphql/pubsub')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const request = require('request-promise-native')
const { promisify } = require('util')
const xml2js = require('xml2js')
const Joi = require('joi')
const lodash = require('lodash')
const { mecaExport } = require('@elifesciences/xpub-meca-export')

const { ON_UPLOAD_PROGRESS } = asyncIterators

const parseString = promisify(xml2js.parseString)

const {
  ManuscriptManager,
  FileManager,
  UserManager,
} = require('@elifesciences/xpub-model')
const manuscriptInputSchema = require('./helpers/manuscriptInputValidationSchema')

const resolvers = {
  Query: {
    async manuscript(_, { id }, { user }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      return ManuscriptManager.find(id, userUuid)
    },
    async manuscripts(_, { belongingTo }, { user }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      let createdBy = userUuid
      if (typeof belongingTo !== 'undefined') {
        // need to be an admin if you are not getting your own stuff
        if (!(await UserManager.isAdmin(userUuid))) {
          throw new Error('Disallowed: This user is not listed as an admin!')
        }

        if (belongingTo === '*') {
          createdBy = undefined
        }
      }
      return ManuscriptManager.all(createdBy)
    },
  },

  Mutation: {
    async createManuscript(_, vars, { user }) {
      if (!user) {
        throw new Error('Not logged in')
      }
      const userUuid = await UserManager.getUuidForProfile(user)
      const manuscript = ManuscriptManager.new()
      manuscript.createdBy = userUuid
      return ManuscriptManager.save(manuscript)
    },

    // TODO restrict this in production
    async deleteManuscript(_, { id }, { user }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      await ManuscriptManager.delete(id, userUuid)
      return id
    },

    async updateManuscript(_, { data }, { user }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      const originalManuscript = await ManuscriptManager.find(data.id, userUuid)
      if (originalManuscript.status !== ManuscriptManager.statuses.INITIAL) {
        throw new Error(
          `Cannot update manuscript with status of ${
            originalManuscript.status
          }`,
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
    },

    async submitManuscript(_, { data }, { user, ip }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      const originalManuscript = await ManuscriptManager.find(data.id, userUuid)
      if (originalManuscript.status !== ManuscriptManager.statuses.INITIAL) {
        throw new Error(
          `Cannot submit manuscript with status of ${
            originalManuscript.status
          }`,
        )
      }

      const manuscriptInput = ManuscriptManager.removeOptionalBlankReviewers(
        data,
      )
      const { error: errorManuscript } = Joi.validate(
        manuscriptInput,
        manuscriptInputSchema,
      )
      if (errorManuscript) {
        logger.error(`Bad manuscript data: ${errorManuscript}`)
        throw new Error(errorManuscript)
      }

      const manuscript = ManuscriptManager.applyInput(
        originalManuscript,
        manuscriptInput,
      )

      manuscript.status = ManuscriptManager.statuses.MECA_EXPORT_PENDING
      await ManuscriptManager.save(manuscript)

      const sourceFile = ManuscriptManager.getSource(manuscript)
      const content = await FileManager.getContent(sourceFile)
      mecaExport(manuscript, content, ip)
        .then(() => {
          logger.info(`Manuscript ${manuscript.id} successfully exported`)
          return ManuscriptManager.save({
            id: manuscript.id,
            status: ManuscriptManager.statuses.MECA_EXPORT_SUCCEEDED,
          })
        })
        .catch(async err => {
          logger.error('MECA export failed', err)
          await ManuscriptManager.save({
            id: manuscript.id,
            status: ManuscriptManager.statuses.MECA_EXPORT_FAILED,
          })
          return mailer.send({
            to: config.get('meca.notificationEmail'),
            subject: 'MECA export failed',
            text: `Manuscript ID: ${manuscript.id}
Manuscript title: ${manuscript.meta.title}
Error:

${err}`,
          })
        })
        .catch(err => {
          logger.error('Error handling MECA export failure', err)
        })

      return manuscript
    },

    async uploadManuscript(_, { file, id, fileSize }, { user }) {
      /**
       * TODO
       * this is not a proper way to check for the file size
       * fileSize is sent from the frontend and might be different
       * than the actual file size
       *
       * for now this is fine since nginx has the same file size limit
       * as this resolver, but in the future if the two values are not
       * equal anymore we should stop the stream chain and make sure
       * everything is revoked (e.g. stored file is unlinked)
       */
      if (fileSize > config.get('fileUpload.maxSizeMB') * 1e6) {
        throw new Error(
          `File size shouldn't exceed ${config.get('fileUpload.maxSizeMB')}MB`,
        )
      }

      const userUuid = await UserManager.getUuidForProfile(user)
      const manuscript = await ManuscriptManager.find(id, userUuid)

      const { stream, filename, mimetype } = await file
      const fileEntity = await FileManager.save(
        FileManager.new({
          manuscriptId: manuscript.id,
          url: `manuscripts/${id}`,
          filename,
          type: 'MANUSCRIPT_SOURCE',
        }),
      )

      const pubsub = await getPubsub()
      const reportProgress = lodash.throttle(progress => {
        pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, {
          uploadProgress: Math.floor(progress * 100),
        })
      }, 200)
      const fileContents = await new Promise((resolve, reject) => {
        let uploadedSize = 0
        const chunks = []
        reportProgress(0)
        stream.on('data', chunk => {
          uploadedSize += chunk.length
          reportProgress(uploadedSize / fileSize)
          chunks.push(chunk)
        })
        stream.on('error', reject)
        stream.on('end', () => {
          resolve(Buffer.concat(chunks))
          if (uploadedSize !== fileSize) {
            logger.warn(
              'Reported file size for manuscript is different than the actual file size',
            )
          }
        })
      })

      try {
        await FileManager.putContent(fileEntity, fileContents, {
          size: fileSize,
        })
      } catch (err) {
        await FileManager.delete(fileEntity.id)
        throw err
      }

      // also send source file to conversion service
      let title = ''
      try {
        const xmlBuffer = await request.post(config.get('scienceBeam.url'), {
          body: fileContents,
          qs: { filename },
          headers: { 'content-type': mimetype },
          timeout: config.get('scienceBeam.timeoutMs'),
        })
        const xmlData = await parseString(xmlBuffer.toString('utf8'))

        if (xmlData.article) {
          const firstArticle = xmlData.article.front[0]
          const articleMeta = firstArticle['article-meta']
          const firstMeta = articleMeta[0]
          const titleGroup = firstMeta['title-group']
          const firstTitleGroup = titleGroup[0]
          const titleArray = firstTitleGroup['article-title']
          title = titleArray[0]
        }
      } catch (error) {
        let errorMessage = ''
        if (error.error.code === 'ETIMEDOUT' || error.error.connect === false) {
          errorMessage = 'Request to science beam timed out'
        } else {
          errorMessage = error.message
        }
        logger.warn('Manuscript conversion failed', {
          error: errorMessage,
          manuscriptId: id,
          filename,
        })
      }

      manuscript.meta.title = title
      await ManuscriptManager.save(manuscript)

      return ManuscriptManager.find(id, userUuid)
    },
    async savePage(_, vars, { user }) {
      const userUuid = await UserManager.getUuidForProfile(user)
      const originalManuscript = await ManuscriptManager.find(vars.id, userUuid)

      originalManuscript.formState = vars.url
      await ManuscriptManager.save(originalManuscript)
      logger.debug(`Updated manuscript`, {
        manuscriptId: vars.id,
        userId: userUuid,
        formState: vars.url,
      })

      return originalManuscript
    },
  },

  Manuscript: {
    async author(manuscript) {
      const team = manuscript.teams.find(t => t.role === 'author')
      if (!team) return { firstName: '', lastName: '', email: '', aff: '' }
      return team.teamMembers[0].alias
    },

    async clientStatus(manuscript) {
      let clientStatus = ''

      switch (manuscript.status) {
        case 'INITIAL':
          clientStatus = 'CONTINUE_SUBMISSION'
          break
        case 'MECA_EXPORT_PENDING':
        case 'MECA_EXPORT_FAILED':
        case 'MECA_EXPORT_SUCCEEDED':
        case 'MECA_IMPORT_FAILED':
        case 'MECA_IMPORT_SUCCEEDED':
          clientStatus = 'SUBMITTED'
          break
        default:
          throw new Error(`Unhandled manuscript status ${manuscript.status}`)
      }

      return clientStatus
    },

    async assignees(manuscript, { role }) {
      const team = manuscript.teams.find(t => t.role === role)
      if (!team) return []

      switch (role) {
        case 'suggestedSeniorEditor':
        case 'opposedSeniorEditor':
        case 'suggestedReviewingEditor':
        case 'opposedReviewingEditor': {
          const assigneeIds = team.teamMembers.map(
            member => member.meta.elifePersonId,
          )
          return UserManager.getEditorsByPersonId(assigneeIds)
        }
        case 'suggestedReviewer':
        case 'opposedReviewer':
          return team.teamMembers.map(member => member.meta)

        default:
          throw new Error(`Unhandled role type ${role}`)
      }
    },
  },

  Assignee: {
    __resolveType: assignee => {
      if (assignee.subjectAreas !== undefined) return 'EditorAlias'
      if (assignee.name !== undefined) return 'ReviewerAlias'
      if (assignee.firstName !== undefined) return 'AuthorAlias'
      return null
    },
  },
}

module.exports = resolvers
