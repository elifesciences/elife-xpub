const logger = require('@pubsweet/logger')
const config = require('config')
const { db } = require('pubsweet-server')
const AWS = require('aws-sdk')

const DATABASE_ERROR = 'Database Error'
const S3_ERROR = 'S3 Error'
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

const checkS3 = () =>
  new Promise(resolve => {
    s3.listObjects({}, (err, response) => {
      if (err) {
        resolve(err)
      } else {
        resolve(response)
      }
    })
  })

const checkDataBase = () =>
  new Promise(resolve => {
    db.select('table_name')
      .from('information_schema.tables')
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })

module.exports = app => {
  app.get('/ping', nocache, async (req, res) => {
    const errors = []
    let statusCode = 200
    let body = SUCCESFUL_RESPONSE
    let dbResponse
    let s3Response
    try {
      ;[dbResponse, s3Response] = await Promise.all([
        checkDataBase(),
        checkS3(),
      ])
    } catch (error) {
      logger.error(`HealthCheckError: ${error}`)
      res.status(500).send(DEFAULT_ERROR)
    }
    if (!dbResponse || dbResponse <= 0 || dbResponse instanceof Error) {
      errors.push(DATABASE_ERROR)
    }
    if (
      !s3Response ||
      !s3Response.Contents ||
      s3Response.Contents === 0 ||
      s3Response instanceof Error
    ) {
      errors.push(S3_ERROR)
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
