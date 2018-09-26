const config = require('config')
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
const { Transform } = require('stream')
const mecaExport = require('@elifesciences/xpub-meca-export')

const { ON_UPLOAD_PROGRESS } = asyncIterators

const parseString = promisify(xml2js.parseString)

const ManuscriptManager = require('.')
const FileManager = require('../file')
const manuscriptInputSchema = require('./helpers/manuscriptInputValidationSchema')
const elifeApi = require('../user/helpers/elife-api')

const resolvers = {
  Query: {
    async currentSubmission(_, vars, { user }) {
      const manuscripts = await ManuscriptManager.findByStatus(
        ManuscriptManager.statuses.INITIAL,
        user,
      )
      if (!manuscripts.length) {
        return null
      }

      return manuscripts[0]
    },
    async manuscript(_, { id }, { user }) {
      return ManuscriptManager.find(id, user)
    },
    async manuscripts(_, vars, { user }) {
      return ManuscriptManager.all(user)
    },
  },

  Mutation: {
    async createSubmission(_, vars, { user }) {
      if (!user) {
        throw new Error('Not logged in')
      }
      const manuscript = ManuscriptManager.new()
      manuscript.createdBy = user
      return ManuscriptManager.save(manuscript)
    },

    // TODO restrict this in production
    async deleteManuscript(_, { id }, { user }) {
      await ManuscriptManager.delete(id, user)
      return id
    },

    async updateSubmission(_, { data }, { user }) {
      const originalManuscript = await ManuscriptManager.find(data.id, user)
      const manuscript = ManuscriptManager.applyInput(originalManuscript, data)

      await ManuscriptManager.save(manuscript)
      logger.debug(`Updated Submission ${data.id} by user ${user}`)

      return manuscript
    },

    async finishSubmission(_, { data }, { user, ip }) {
      const originalManuscript = await ManuscriptManager.find(data.id, user)

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

      const content = 'dummy content'
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

      const manuscript = await ManuscriptManager.find(id, user)

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
      let uploadedSize = 0
      let startTime = process.hrtime()
      const progressReport = new Transform({
        transform(chunk, encoding, done) {
          uploadedSize += chunk.length
          const uploadProgress = Math.floor((uploadedSize * 100) / fileSize)
          if (uploadProgress < 100) {
            const elapsedTime = process.hrtime(startTime)
            // MS_IN_S = 1e3, NS_IN_MS = 1e6
            const elapsedTimeMs = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6
            if (elapsedTimeMs < 500) {
              return done(null, chunk)
            }
            startTime = process.hrtime()
          }
          pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, {
            uploadProgress,
          })
          return done(null, chunk)
        },
      })
      progressReport.on('end', () => {
        if (uploadedSize !== fileSize) {
          logger.warn(
            'Reported file size for manuscript is different than the actual file size',
          )
        }
      })

      // save source file locally
      const saveFileStream = stream.pipe(progressReport)
      const saveFilePromise = FileManager.putContent(
        fileEntity,
        saveFileStream,
        { size: fileSize },
      )

      // also send source file to conversion service
      const convertFileRequest = request.post(config.get('scienceBeam.url'), {
        qs: { filename },
        headers: { 'content-type': mimetype },
      })
      stream.pipe(convertFileRequest)

      let title = ''
      try {
        const xmlBuffer = await convertFileRequest
        const [xmlData] = await Promise.all([
          parseString(xmlBuffer.toString('utf8')),
          saveFilePromise,
        ])

        if (xmlData.article) {
          const firstArticle = xmlData.article.front[0]
          const articleMeta = firstArticle['article-meta']
          const firstMeta = articleMeta[0]
          const titleGroup = firstMeta['title-group']
          const firstTitleGroup = titleGroup[0]
          const titleArray = firstTitleGroup['article-title']
          title = titleArray[0]
        }
      } catch (err) {
        logger.warn('Manuscript conversion failed', err)
      }

      manuscript.meta.title = title
      await ManuscriptManager.save(manuscript)

      return ManuscriptManager.find(id, user)
    },
  },

  Manuscript: {
    async author(manuscript) {
      const team = manuscript.teams.find(t => t.role === 'author')
      if (!team) return { firstName: '', lastName: '', email: '', aff: '' }
      return team.teamMembers[0].alias
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
          return elifeApi.peopleById(assigneeIds)
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
