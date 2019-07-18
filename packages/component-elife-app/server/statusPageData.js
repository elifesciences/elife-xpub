const { db } = require('@pubsweet/db-manager')
const config = require('config')
const AWS = require('aws-sdk')
const SftpClient = require('ssh2-sftp-client')

const S3_API_VERSION = '2006-03-01'
const sftp = new SftpClient()

const s3 = new AWS.S3({
  ...config.aws.credentials,
  ...config.aws.s3,
  apiVersion: S3_API_VERSION,
})

const checkS3 = require('./health/health-check-s3')
const checkDb = require('./health/health-check-db')
const checkSFTP = require('./health/health-check-sftp')

const getStatusPageData = async () => {
  let generalError
  let dbResponse
  let s3Response
  let mecaResponse

  try {
    ;[dbResponse, s3Response, mecaResponse] = await Promise.all([
      checkDb(db),
      checkS3(config, s3),
      checkSFTP(config, sftp),
    ])
  } catch (error) {
    generalError = error.message
  }

  return {
    generalError,
    dbResponse,
    s3Response,
    mecaResponse,
  }
}

module.exports = getStatusPageData
