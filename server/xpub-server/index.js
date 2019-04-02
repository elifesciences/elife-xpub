const os = require('os')
const logger = require('@pubsweet/logger')
const cleanup = require('@elifesciences/component-elife-app/server/cleanup')

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
  migrationsPath: `./schema/migrations`,
}
