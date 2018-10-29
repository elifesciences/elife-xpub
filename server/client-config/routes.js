const logger = require('@pubsweet/logger')
const config = require('config')
const { pickBy } = require('lodash')
const DBExists = require('@pubsweet/db-manager/src/helpers/db-exists.js')
const AWS = require('aws-sdk')

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
  apiVersion: '2006-03-01',
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
        sendResult(404, 'database error')
        return
      }
      const { Body } = await s3.getObject({ Key: 'test-file' }).promise()
      if (!Body) {
        sendResult(404, 's3 connection error')
        return
      }

      sendResult(200, 'pong')
    } catch (error) {
      sendResult(500, error)
    }
  })
}
