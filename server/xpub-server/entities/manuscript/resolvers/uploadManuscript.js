const config = require('config')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')
const logger = require('@pubsweet/logger')
const lodash = require('lodash')
const scienceBeamApi = require('./scienceBeamApi')

const { ON_UPLOAD_PROGRESS } = pubsubManager.asyncIterators

const { Manuscript, File, User } = require('@elifesciences/xpub-model')

function addFileEntityToManuscript(manuscriptEntity, fileEntity) {
  const manuscript = manuscriptEntity
  const manuscriptUploadIndex = manuscript.files.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE',
  )

  if (manuscriptUploadIndex < 0) {
    manuscript.files.push(fileEntity)
  } else {
    manuscript.files[manuscriptUploadIndex] = fileEntity
  }
}

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

  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(id, userUuid)

  const { stream, filename, mimetype } = await file
  const fileEntity = await new File({
    manuscriptId: manuscript.id,
    url: `manuscripts/${id}`,
    filename,
    type: 'MANUSCRIPT_SOURCE',
  }).save()

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
    await fileEntity.putContent(fileContents, {
      size: fileSize,
    })
  } catch (err) {
    await fileEntity.delete()
    throw err
  }

  let title = ''
  try {
    // also send source file to conversion service
    title = await scienceBeamApi.extractSemantics(
      config,
      fileContents,
      filename,
      mimetype,
    )
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
  addFileEntityToManuscript(manuscript, fileEntity)
  manuscript.meta.title = title
  await manuscript.save()

  return manuscript
}

module.exports = uploadManuscript
