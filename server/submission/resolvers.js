const lodash = require('lodash')
const config = require('config')
const User = require('pubsweet-server/src/models/User')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')
const request = require('request-promise-native')
const { promisify } = require('util')
const xml2js = require('xml2js')
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const Joi = require('joi')
const {
  emptyManuscript,
  manuscriptSchema,
  removeOptionalBlankReviewers,
} = require('./definitions')

const parseString = promisify(xml2js.parseString)
const randomBytes = promisify(crypto.randomBytes)
const uploadsPath = config.get('pubsweet-server').uploads

const db = require('../db-helpers/')
const fetchOrcidDetails = require('../auth/fetchUserDetails')
const elifeApi = require('./elife-api')

const staticManifest = `<dar>
  <documents>
    <document id="manuscript" type="article" path="manuscript.xml" />
  </documents>
  <assets>
  </assets>
</dar>
`

const mergeObjects = (...inputs) =>
  lodash.mergeWith(
    ...inputs,
    // always replace arrays instead of merging
    (objValue, srcValue) => {
      if (lodash.isArray(srcValue)) {
        return srcValue
      }
      return undefined
    },
  )

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      const rows = await db.select({
        createdBy: ctx.user,
        status: 'INITIAL',
      })

      if (!rows.length) {
        return null
      }

      return rows[0]
    },
    async orcidDetails(_, vars, ctx) {
      const user = await User.find(ctx.user)
      return fetchOrcidDetails(user)
    },
    async manuscript(_, { id }) {
      return db.selectId(id)
    },
    async manuscripts() {
      return db.select({ type: 'manuscript' })
    },
    async editors(_, { role }) {
      return elifeApi.people(role)
    },
  },

  Mutation: {
    async createSubmission(_, vars, ctx) {
      const manuscript = lodash.cloneDeep(emptyManuscript)
      const manuscriptDb = db.manuscriptGqlToDb(manuscript, ctx.user)
      manuscript.id = await db.save(manuscriptDb)
      return manuscript
    },

    async deleteManuscript(_, { id }) {
      await db.deleteManuscript(id)
      return id
    },

    async updateSubmission(_, { data }, ctx) {
      logger.debug('Update Submission - starting')

      const manuscript = await db.selectId(data.id)
      db.checkPermission(manuscript, ctx.user)
      mergeObjects(manuscript, data)

      await db.update(db.manuscriptGqlToDb(manuscript, ctx.user), data.id)
      logger.debug(`Updated Submission ${data.id} by user ${ctx.user}`)

      return manuscript
    },
    async finishSubmission(_, { data }, ctx) {
      const manuscript = await db.selectId(data.id)
      db.checkPermission(manuscript, ctx.user)
      const newManuscript = mergeObjects({}, manuscript, data)

      // Before validation remove any blank optional reviewers the UI made.
      removeOptionalBlankReviewers(newManuscript.suggestedReviewers)

      const { error: errorManuscript } = Joi.validate(
        newManuscript,
        manuscriptSchema,
      )
      if (errorManuscript) {
        logger.error(`Bad manuscript data: ${errorManuscript}`)
        throw new Error(errorManuscript)
      }

      newManuscript.status = 'QA'
      const newManuscriptDb = db.manuscriptGqlToDb(newManuscript, ctx.user)
      await db.update(newManuscriptDb, data.id)

      const user = await User.find(ctx.user)
      if (user.email !== newManuscript.author.email) {
        mailer
          .send({
            to: newManuscript.author.email,
            text: 'Please verify that you are a corresponding author',
          })
          .catch(err => {
            logger.error(
              `Error sending corresponding author verification email: ${err}`,
            )
          })
      }

      return newManuscript
    },

    async uploadManuscript(_, { file, id }) {
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

      const manuscript = await db.selectId(id)
      manuscript.files.push({
        url: manuscriptSourcePath,
        filename,
        type: 'MANUSCRIPT_SOURCE',
      })
      manuscript.meta.title = title
      await db.update(db.manuscriptGqlToDb(manuscript), id)

      return manuscript
    },
  },

  Manuscript: {
    async suggestedSeniorEditors(manuscript) {
      return elifeApi.peopleById(manuscript.suggestedSeniorEditors)
    },
    async opposedSeniorEditors(manuscript) {
      return elifeApi.peopleById(manuscript.opposedSeniorEditors)
    },
    async suggestedReviewingEditors(manuscript) {
      return elifeApi.peopleById(manuscript.suggestedReviewingEditors)
    },
    async opposedReviewingEditors(manuscript) {
      return elifeApi.peopleById(manuscript.opposedReviewingEditors)
    },
  },
}

module.exports = resolvers
