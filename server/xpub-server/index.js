const os = require('os')
const fs = require('fs')
const logger = require('@pubsweet/logger')
const cleanup = require('./cleanup')

// concatenate schemas
const xpubTypeDefs = fs.readFileSync(
  `${__dirname}/schema/xpub.graphqls`,
  'utf8',
)

const typeDefs = `
  ${xpubTypeDefs}
`

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
  typeDefs,
  migrationsPath: `./schema/migrations`,
}
