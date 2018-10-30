const logger = require('@pubsweet/logger')
const config = require('config')
const { pickBy } = require('lodash')
const DBExists = require('@pubsweet/db-manager/src/helpers/db-exists.js')
const AWS = require('aws-sdk')

const FILE_HEALTH_CHECK = 'healtcheck-file'
const DATABASE_ERROR = 'Database Error'
const S3_CONNECTION_ERROR = 'S3 Connection Error'
const DEFAULT_ERROR = 'Internal Server Error'
const SUCCESFULL_RESPONSE = 'pong'
const S3_API_VERSION = '2006-03-01'

const template = clientConfig => `
  window.config = ${JSON.stringify(clientConfig)}
`
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

const sendResult = (res, statusCode, body) => {
  if (statusCode !== 200) {
    logger.error(`HealthCheckError: ${body}`)
  }
  res.send(statusCode, body)
}

module.exports = app => {
  app.get('/config.js', (req, res) => {
    const clientConfig = pickBy(config, value => value.isPublic)
    const response = template(clientConfig)
    res.type('js')
    res.send(response)
  })

  app.get('/ping', nocache, async (req, res) => {
    try {
      const exists = await DBExists()
      if (!exists) {
        sendResult(res, 404, DATABASE_ERROR)
        return
      }
      const { Body } = await s3.getObject({ Key: FILE_HEALTH_CHECK }).promise()
      if (!Body) {
        sendResult(res, 404, S3_CONNECTION_ERROR)
        return
      }

      sendResult(res, 200, SUCCESFULL_RESPONSE)
    } catch (error) {
      logger.error(`HealthCheckError: ${error}`)
      res.send(500, DEFAULT_ERROR)
    }
  })
}
