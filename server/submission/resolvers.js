const lodash = require('lodash')
const config = require('config')
const User = require('pubsweet-server/src/models/User')
const request = require('request-promise-native')
const { promisify } = require('util')
const xml2js = require('xml2js')
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const { emptyManuscript } = require('./definitions')

const parseString = promisify(xml2js.parseString)
const randomBytes = promisify(crypto.randomBytes)
const uploadsPath = config.get('pubsweet-server').uploads

const db = require('../db-helpers/')
const fetchOrcidDetails = require('../auth/fetchUserDetails')

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
      const rows = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
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
  },

  Mutation: {
    async createSubmission(_, vars, ctx) {
      const manuscript = lodash.cloneDeep(emptyManuscript)
      const manuscriptDb = db.manuscriptGqlToDb(manuscript, ctx.user)
      manuscript.id = await db.save(manuscriptDb)
      return manuscript
    },
    async updateSubmission(_, { data }, ctx) {
      const manuscript = await db.selectId(data.id)
      db.checkPermission(manuscript, ctx.user)

      const newManuscript = lodash.merge({}, manuscript, data)
      const newManuscriptDb = db.manuscriptGqlToDb(newManuscript, ctx.user)
      await db.update(newManuscriptDb, data.id)

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
      const title =
        xmlData.article.front[0]['article-meta'][0]['title-group'][0][
          'article-title'
        ][0]

      const manuscript = await db.selectId(id)
      manuscript.files.push({
        url: manuscriptSourcePath,
        name: filename,
        type: 'MANUSCRIPT_SOURCE',
      })
      manuscript.title = title
      await db.update(db.manuscriptGqlToDb(manuscript), id)

      return manuscript
    },
  },
}

module.exports = resolvers
