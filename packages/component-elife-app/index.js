const fs = require('fs')
const path = require('path')
const os = require('os')
const logger = require('@pubsweet/logger')

const resolvers = require('./server/resolvers')
const cleanup = require('./server/cleanup')
const config = require('config')

const appMessage = action =>
  `${action} Application: ${os.hostname()}, PID: ${process.pid}`

const stopServer = () => {
  // handle the application cleanup in here
  logger.info(appMessage('Stopping'))
}

logger.info(appMessage('Starting'))
logger.info(
  `Feature status: ${JSON.stringify(config.get('features'), null, 4)}`,
)

cleanup.Cleanup(process, logger, stopServer)

module.exports = {
  server: () => require('./server/routes'),
  resolvers,
  typeDefs: fs.readFileSync(
    path.join(__dirname, '/server/typeDefs.graphqls'),
    'utf8',
  ),
}
