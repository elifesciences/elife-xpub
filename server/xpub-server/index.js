const os = require('os')
const fs = require('fs')
const logger = require('@pubsweet/logger')
const cleanup = require('@elifesciences/component-elife-app/server/cleanup')

// concatenate schemas
const xpubTypeDefs = fs.readFileSync(
  `${__dirname}/schema/xpub.graphqls`,
  'utf8',
)
const elifeTypeDefs = fs.readFileSync(
  `${__dirname}/schema/elife.graphqls`,
  'utf8',
)

const typeDefs = `
  ${xpubTypeDefs}
  ${elifeTypeDefs}
`

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
  typeDefs,
  migrationsPath: `./schema/migrations`,
}
