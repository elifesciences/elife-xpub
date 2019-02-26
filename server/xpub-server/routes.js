const logger = require('@pubsweet/logger')
const { checkDataBase, checkS3 } = require('./health')

const DATABASE_ERROR = 'Database Error'
const S3_ERROR = 'S3 Error'
const DEFAULT_ERROR = 'Internal Server Error'
const SUCCESSFUL_RESPONSE = 'pong'

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}

let lastHealthStatus = null

module.exports = app => {
  app.get('/ping', nocache, async (req, res) => {
    const errors = []
    let statusCode = 200
    let body = SUCCESSFUL_RESPONSE
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

  app.get('/status', nocache, async (req, res) => {
    res.status(200).send({})
  })

  app.get('/redirect', nocache, async (req, res) => {
    res.status(200).send({})
  })
}
