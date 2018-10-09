const config = require('config')
const SFTP = require('./client/sftp')
const s3 = require('./client/s3')
const logger = require('@pubsweet/logger')

const mecaPostfix = '-meca.zip'

async function uploadToS3(file, manuscriptId) {
  if (config.get('meca.s3.disableUpload')) {
    logger.warn('MECA S3 upload is disabled')
    return
  }
  const params = {
    Body: file,
    Key: `${config.get('meca.s3.remotePath')}/${manuscriptId}${mecaPostfix}`,
    ACL: 'private',
    ContentType: 'application/zip',
  }

  logger.info(`Uploading MECA archive to S3`, { manuscriptId })
  await s3.putObject(params).promise()
}

async function uploadToSFTP(file, manuscriptId) {
  if (config.get('meca.sftp.disableUpload')) {
    logger.warn('MECA SFTP upload is disabled')
    return
  }
  logger.info(`Uploading MECA archive to SFTP`, { manuscriptId })
  const sftp = await SFTP()
  const remotePath = config.get('meca.sftp.remotePath')
  await sftp.mkdir(remotePath, true)
  const transferName = `${remotePath}/${manuscriptId}.transfer`
  const finalName = `${remotePath}/${manuscriptId}${mecaPostfix}`
  await sftp.put(file, transferName)
  await sftp.rename(transferName, finalName)
  await sftp.end()
}

async function upload(file, id) {
  await Promise.all([uploadToSFTP(file, id), uploadToS3(file, id)])
}

module.exports = upload
