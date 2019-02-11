const config = require('config')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')
const logger = require('@pubsweet/logger')
const scienceBeamApi = require('../../../../xpub-controller/client/scienceBeamApi')

const { ON_UPLOAD_PROGRESS } = pubsubManager.asyncIterators

const { Manuscript, User } = require('@elifesciences/xpub-model')
const { File } = require('@elifesciences/xpub-model')
const { S3Storage } = require('@elifesciences/xpub-controller')

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

  // make sure the manuscript exists
  await Manuscript.find(id, userUuid)
  const { stream, filename, mimetype: mimeType } = await file
  let fileEntity = new File({
    manuscriptId: id,
    url: `manuscripts/${id}`,
    filename,
    type: 'MANUSCRIPT_SOURCE_PENDING',
    mimeType,
  })
  await fileEntity.save()
  const fileId = fileEntity.id

  logger.info(`Manuscript Upload Size: ${filename}, ${fileSize} | ${id}`)

  const pubsub = await pubsubManager.getPubsub()

  // Predict upload time - The analysis was done on #839
  const predictedTime = 5 + 4.67e-6 * fileSize
  const startedTime = Date.now()

  const handle = setInterval(() => {
    const elapsed = Date.now() - startedTime
    let progress = parseInt((100 * elapsed) / 1000 / predictedTime, 10)
    // don't let the prediction complete the upload
    if (progress > 99) progress = 99
    pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, {
      manuscriptUploadProgress: { manuscriptId: id, progress },
    })
  }, 200)

  logger.info(`Manuscript Upload fileContents::start ${filename} | ${id}`)
  const fileContents = await new Promise((resolve, reject) => {
    let uploadedSize = 0
    const chunks = []
    stream.on('data', chunk => {
      uploadedSize += chunk.length
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
  await fileEntity.updateStatus('UPLOADED')

  logger.info(`Manuscript Upload fileContents::end ${filename} | ${id}`)

  logger.info(`Manuscript Upload S3::start ${filename} | ${id}`)

  fileEntity = await File.find(fileId)
  try {
    await S3Storage.putContent(fileEntity, fileContents, {
      size: fileSize,
    })
    await fileEntity.updateStatus('STORED')
  } catch (err) {
    logger.error(`Manuscript was not uploaded to S3: ${err} | ${id}`)
    await fileEntity.updateStatus('CANCELLED')
    await fileEntity.delete()
    clearInterval(handle)
    throw err
  }

  logger.info(`Manuscript Upload S3::end ${filename} | ${id}`)

  let title = ''
  try {
    // also send source file to conversion service
    title = await scienceBeamApi.extractSemantics(
      config,
      fileContents,
      filename,
      mimeType,
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

  // After the length file operations above - now update the manuscript...
  const manuscript = await Manuscript.find(id, userUuid)
  const oldFileIndex = manuscript.files.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE',
  )

  logger.info(
    `Manuscript Upload found index ${oldFileIndex} ${
      fileEntity.filename
    } | ${id}`,
  )

  if (oldFileIndex >= 0) {
    const oldFile = await File.find(manuscript.files[oldFileIndex].id)
    manuscript.files.splice(oldFileIndex, 1)
    await oldFile.delete()
  }

  const pendingFileIndex = manuscript.files.findIndex(
    element => element.type === 'MANUSCRIPT_SOURCE_PENDING',
  )

  manuscript.files[pendingFileIndex].type = 'MANUSCRIPT_SOURCE'

  logger.info(`Manuscript Upload Manuscript::save ${title} | ${id}`)
  manuscript.meta.title = title
  await manuscript.save()

  // validation
  const m = await Manuscript.find(id, userUuid)
  const sourceList = m.files.filter(f => f.type === 'MANUSCRIPT_SOURCE')
  const pendingList = m.files.filter(
    f => f.type === 'MANUSCRIPT_SOURCE_PENDING',
  )
  if (sourceList.length !== 1 || pendingList.length !== 0) {
    logger.error(`Validation failed ${JSON.stringify(m, null, 4)}`)
    throw new Error(`Validation Failure on ${m.id}`)
  }

  logger.info(
    `Manuscript Upload Manuscript::saved ${manuscript.meta.title} | ${id}`,
  )

  clearInterval(handle)
  pubsub.publish(`${ON_UPLOAD_PROGRESS}.${user}`, {
    manuscriptUploadProgress: { manuscriptId: id, progress: 100 },
  })
  const actualTime = (Date.now() - startedTime) / 1000
  logger.info(
    `Manuscript Upload Time, Actual (${actualTime}) , Predicted (${predictedTime}) | ${id}`,
  )

  return manuscript
}

module.exports = uploadManuscript
