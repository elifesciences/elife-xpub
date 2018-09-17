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
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const Joi = require('joi')
const { Transform } = require('stream')
const mecaExport = require('@elifesciences/xpub-meca-export')

const { ON_UPLOAD_PROGRESS } = asyncIterators

const parseString = promisify(xml2js.parseString)
const randomBytes = promisify(crypto.randomBytes)
const uploadsPath = config.get('pubsweet-server').uploads

const Manuscript = require('.')
const manuscriptInputSchema = require('./helpers/manuscriptInputValidationSchema')
const elifeApi = require('../user/helpers/elife-api')

const darManifest = `<dar>
  <documents>
    <document id="manuscript" type="article" path="manuscript.xml" />
  </documents>
  <assets>
  </assets>
</dar>
`

const resolvers = {
  Query: {
    async currentSubmission(_, vars, { user }) {
      const manuscripts = await Manuscript.findByStatus('INITIAL', user)
      if (!manuscripts.length) {
        return null
      }

      return manuscripts[0]
    },
    async manuscript(_, { id }, { user }) {
      return Manuscript.find(id, user)
    },
    async manuscripts(_, vars, { user }) {
      return Manuscript.all(user)
    },
  },

  Mutation: {
    async createSubmission(_, vars, { user }) {
      if (!user) {
        throw new Error('Not logged in')
      }
      const manuscript = Manuscript.new()
      manuscript.createdBy = user
      return Manuscript.save(manuscript)
    },

    // TODO restrict this in production
    async deleteManuscript(_, { id }, { user }) {
      await Manuscript.delete(id, user)
      return id
    },

    async updateSubmission(_, { data }, { user }) {
      const originalManuscript = await Manuscript.find(data.id, user)
      const manuscript = Manuscript.applyInput(originalManuscript, data)

      await Manuscript.save(manuscript)
      logger.debug(`Updated Submission ${data.id} by user ${user}`)

      return manuscript
    },

    async finishSubmission(_, { data }, { user, ip }) {
      const originalManuscript = await Manuscript.find(data.id, user)

      const manuscriptInput = Manuscript.removeOptionalBlankReviewers(data)
      const { error: errorManuscript } = Joi.validate(
        manuscriptInput,
        manuscriptInputSchema,
      )
      if (errorManuscript) {
        logger.error(`Bad manuscript data: ${errorManuscript}`)
        throw new Error(errorManuscript)
      }

      const manuscript = Manuscript.applyInput(
        originalManuscript,
        manuscriptInput,
      )

      manuscript.status = 'QA'
      await Manuscript.save(manuscript)

      mecaExport(manuscript.id, user, ip)
        .then(() =>
          logger.info(`Manuscript ${manuscript.id} successfully exported`),
        )
        .catch(async err => {
          logger.error('MECA export failed', err)
          await Manuscript.save({
            id: manuscript.id,
            status: 'FAILED_MECA_EXPORT',
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
      const manuscript = await Manuscript.find(id, user)

      const { stream, filename, mimetype } = await file

      const manuscriptContainer = path.join(uploadsPath, id)
      await fs.ensureDir(manuscriptContainer)
      const raw = await randomBytes(16)
      const generatedFilename = raw.toString('hex') + path.extname(filename)
      const manuscriptSourcePath = path.join(
        manuscriptContainer,
        generatedFilename,
      )
      const manuscriptJatsPath = path.join(
        manuscriptContainer,
        'manuscript.xml',
      )
      const manuscriptManifestPath = path.join(
        manuscriptContainer,
        'manifest.xml',
      )

      const pubsub = await getPubsub()
      let uploadedSize = 0
      const progressReport = new Transform({
        transform(chunk, encoding, done) {
          uploadedSize += chunk.length
          const uploadProgress = Math.floor((uploadedSize * 100) / fileSize)
          pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, {
            uploadProgress,
          })
          done(null, chunk)
        },
      })

      // save source file locally
      const saveFileStream = fs.createWriteStream(manuscriptSourcePath)
      stream.pipe(progressReport).pipe(saveFileStream)

      /* let uploadedSize = 0 */
      /* const pubsub = await getPubsub() */
      /* stream.on('data', chunk => { */
      /*   uploadedSize += chunk.length */
      /*   if (uploadedSize > config.get('fileUpload.maxSizeMB') * 1e6) { */
      /*     throw new Error( */
      /*       `File size shouldn't exceed ${config.get( */
      /*         'fileUpload.maxSizeMB', */
      /*       )}MB`, */
      /*     ) */
      /*   } */
      /*   const uploadProgress = Math.floor((uploadedSize * 100) / fileSize) */
      /*   pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, { */
      /*     uploadProgress, */
      /*   }) */
      /* }) */
      /* stream.on('end', () => { */
      /*   if (uploadedSize !== fileSize) { */
      /*     logger.warn( */
      /*       'Reported file size for manuscript is different than the actual file size', */
      /*     ) */
      /*   } */
      /* }) */

      const saveFilePromise = new Promise((resolve, reject) => {
        saveFileStream.on('finish', () => resolve(true))
        saveFileStream.on('error', reject)
      })

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
          fs.writeFile(manuscriptJatsPath, xmlBuffer),
          fs.writeFile(manuscriptManifestPath, darManifest),
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

      manuscript.files.push({
        url: manuscriptSourcePath,
        filename,
        type: 'MANUSCRIPT_SOURCE',
      })
      manuscript.meta.title = title
      await Manuscript.save(manuscript)

      return manuscript
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
