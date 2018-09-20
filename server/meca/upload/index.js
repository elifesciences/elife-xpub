const config = require('config')
const SFTP = require('./client/sftp')
const s3 = require('./client/s3')
const logger = require('@pubsweet/logger')

async function uploadToS3(file, id) {
  if (config.get('meca.s3.disableUpload')) {
    logger.warn('Meca S3 upload is disabled')
    return
  }
  const params = {
    Body: file,
    Key: `${config.get('meca.s3.remotePath')}/${id}.zip`,
    ACL: 'private',
    ContentType: 'application/zip',
  }

  logger.info(`Uploading to S3`)
  await s3.putObject(params).promise()
}

async function uploadToSFTP(file, id) {
  if (config.get('meca.sftp.disableUpload')) {
    logger.warn('Meca SFTP is disabled')
    return
  }
  logger.info(`Uploading to SFTP`)
  const sftp = await SFTP()
  const remotePath = config.get('meca.sftp.remotePath')
  await sftp.mkdir(remotePath, true)
  await sftp.put(file, `${remotePath}/${id}`)
  await sftp.end()
}

async function upload(file, id) {
  await Promise.all([uploadToSFTP(file, id), uploadToS3(file, id)])
}

module.exports = upload
