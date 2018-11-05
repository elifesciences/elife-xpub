const config = require('config')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')
const logger = require('@pubsweet/logger')
const request = require('request-promise-native')
const { promisify } = require('util')
const xml2js = require('xml2js')
const lodash = require('lodash')

const { ON_UPLOAD_PROGRESS } = pubsubManager.asyncIterators

const parseString = promisify(xml2js.parseString)

const {
  ManuscriptManager,
  FileManager,
  UserManager,
} = require('@elifesciences/xpub-model')

async function uploadManuscript(_, { file, id, fileSize }, { user }) {
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

  const pubsub = await pubsubManager.getPubsub()
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
}

module.exports = uploadManuscript
