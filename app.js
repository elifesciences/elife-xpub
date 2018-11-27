require('newrelic')

const logger = require('@pubsweet/logger')
const { startServer } = require('pubsweet-server')
const { logConfigSources } = require('@elifesciences/util')

logConfigSources(logger.info)

startServer().catch(err => {
  logger.error('FATAL ERROR, SHUTTING DOWN:', err)
  process.exit(1)
})
