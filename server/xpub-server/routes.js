const logger = require('@pubsweet/logger')
const config = require('config')
const { dbExists } = require('@pubsweet/db-manager')
const AWS = require('aws-sdk')

const FILE_HEALTH_CHECK = 'healthcheck-file'
const DATABASE_ERROR = 'Database Error'
const S3_CONNECTION_ERROR = 'S3 Connection Error'
const DEFAULT_ERROR = 'Internal Server Error'
const SUCCESFUL_RESPONSE = 'pong'
const S3_API_VERSION = '2006-03-01'

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}

const s3 = new AWS.S3({
  ...config.aws.credentials,
  ...config.aws.s3,
  apiVersion: S3_API_VERSION,
})

let lastHealthStatus = null

module.exports = app => {
  app.get('/ping', nocache, async (req, res) => {
    const errors = []
    let statusCode = 200
    let body = SUCCESFUL_RESPONSE
    let response
    try {
      response = await Promise.all([
        dbExists(),
        s3.getObject({ Key: FILE_HEALTH_CHECK }).promise(),
      ])
    } catch (error) {
      logger.error(`HealthCheckError: ${error}`)
      res.status(500).send(DEFAULT_ERROR)
    }
    if (!response[0] || response[0] <= 0) {
      errors.push(DATABASE_ERROR)
    }
    if (!response[1] || !response[1].Body) {
      errors.push(S3_CONNECTION_ERROR)
    }

    const thisHealthStatus = errors.length === 0

    if (lastHealthStatus !== thisHealthStatus) {
      // only log changes in state to not flood the logs
      logger.error(`HealthStats: ${thisHealthStatus}, Errors: ${errors}`)
      lastHealthStatus = thisHealthStatus
    }

    if (errors.length > 0) {
      body = errors
      if (statusCode === 200) {
        // this is http gone
        statusCode = 410
      }
    }
    res.status(statusCode).send(body)
  })
}
