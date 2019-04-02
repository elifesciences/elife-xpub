const os = require('os')
const logger = require('@pubsweet/logger')
const cleanup = require('./cleanup')

const registerRoutes = app => {
  require('./routes')(app)
}

const appMessage = action =>
  `${action} Application: ${os.hostname()}, PID: ${process.pid}`

const stopServer = () => {
  // handle the application cleanup in here
  logger.info(appMessage('Stopping'))
}

logger.info(appMessage('Starting'))

// eslint-disable-next-line no-unused-vars
const cleanupHandler = cleanup.Cleanup(process, logger, stopServer)

module.exports = {
  backend: () => registerRoutes,
  migrationsPath: `./schema/migrations`,
}
