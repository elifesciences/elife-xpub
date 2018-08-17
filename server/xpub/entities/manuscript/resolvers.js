const config = require('config')
const User = require('../user')
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

const { ON_UPLOAD_PROGRESS } = asyncIterators

const parseString = promisify(xml2js.parseString)
const randomBytes = promisify(crypto.randomBytes)
const uploadsPath = config.get('pubsweet-server').uploads

const Manuscript = require('.')
const manuscriptInputSchema = require('./helpers/manuscriptInputValidationSchema')
const elifeApi = require('../user/helpers/elife-api')

const staticManifest = `<dar>
  <documents>
    <document id="manuscript" type="article" path="manuscript.xml" />
  </documents>
  <assets>
  </assets>
</dar>
`

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      const manuscripts = await Manuscript.findByStatus('INITIAL', ctx.user)
      if (!manuscripts.length) {
        return null
      }

      return manuscripts[0]
    },
    async manuscript(_, { id }) {
      return Manuscript.find(id)
    },
    async manuscripts() {
      return Manuscript.all()
    },
  },

  Mutation: {
    async createSubmission(_, vars, ctx) {
      const manuscript = Manuscript.new()
      manuscript.createdBy = ctx.user
      return Manuscript.save(manuscript)
    },

    async deleteManuscript(_, { id }) {
      await Manuscript.delete(id)
      return id
    },

    async updateSubmission(_, { data }, ctx) {
      const originalManuscript = await Manuscript.find(data.id)
      Manuscript.checkPermission(originalManuscript, ctx.user)
      const manuscript = Manuscript.applyInput(originalManuscript, data)

      await Manuscript.save(manuscript)
      logger.debug(`Updated Submission ${data.id} by user ${ctx.user}`)

      return manuscript
    },

    async finishSubmission(_, { data }, ctx) {
      const modifiedManuscriptInput = Manuscript.removeOptionalBlankReviewers(
        data,
      )
      const { error: errorManuscript } = Joi.validate(
        modifiedManuscriptInput,
        manuscriptInputSchema,
      )
      if (errorManuscript) {
        logger.error(`Bad manuscript data: ${errorManuscript}`)
        throw new Error(errorManuscript)
      }

      const originalManuscript = await Manuscript.find(
        modifiedManuscriptInput.id,
      )
      Manuscript.checkPermission(originalManuscript, ctx.user)
      const manuscript = Manuscript.applyInput(
        originalManuscript,
        modifiedManuscriptInput,
      )

      manuscript.status = 'QA'
      await Manuscript.save(manuscript)

      const user = await User.find(ctx.user)
      if (user.email !== modifiedManuscriptInput.author.email) {
        mailer
          .send({
            to: modifiedManuscriptInput.author.email,
            text: 'Please verify that you are a corresponding author',
          })
          .catch(err => {
            logger.error(
              `Error sending corresponding author verification email: ${err}`,
            )
          })
      }

      return manuscript
    },

    async uploadManuscript(_, { file, id, fileSize }, context) {
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

      // save source file locally
      const saveFileStream = fs.createWriteStream(manuscriptSourcePath)
      stream.pipe(saveFileStream)

      let uploadedSize = 0
      const pubsub = await getPubsub()
      stream.on('data', chunk => {
        uploadedSize += chunk.length
        const uploadProgress = Math.floor(uploadedSize * 100 / fileSize)
        pubsub.publish(`${ON_UPLOAD_PROGRESS}.${context.user}`, {
          uploadProgress,
        })
      })
      const saveFilePromise = new Promise((resolve, reject) => {
        saveFileStream.on('finish', () => resolve(true))
        saveFileStream.on('error', reject)
      })

      // also send source file to conversion service
      const convertFileStream = request.post(config.get('scienceBeam.url'), {
        qs: { filename },
        headers: { 'content-type': mimetype },
      })
      stream.pipe(convertFileStream)
      const convertedFilePromise = new Promise((resolve, reject) => {
        const chunks = []
        convertFileStream.on('data', chunk => chunks.push(chunk))
        convertFileStream.on('end', () => resolve(Buffer.concat(chunks)))
        convertFileStream.on('error', reject)
      })

      const [xmlString] = await Promise.all([
        convertedFilePromise,
        saveFilePromise,
      ])

      const [xmlData] = await Promise.all([
        parseString(xmlString.toString('utf8')),
        fs.writeFile(manuscriptJatsPath, xmlString),
        fs.writeFile(manuscriptManifestPath, staticManifest),
      ])

      let title = ''
      if (xmlData.article) {
        const firstArticle = xmlData.article.front[0]
        const articleMeta = firstArticle['article-meta']
        const firstMeta = articleMeta[0]
        const titleGroup = firstMeta['title-group']
        const firstTitleGroup = titleGroup[0]
        const titleArray = firstTitleGroup['article-title']
        title = titleArray[0]
      }

      const manuscript = await Manuscript.find(id)
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
