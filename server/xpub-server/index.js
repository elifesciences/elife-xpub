const os = require('os')
const { merge } = require('lodash')
const fs = require('fs')
const logger = require('@pubsweet/logger')
const cleanup = require('./cleanup')

// concatenate schemas
const xpubTypeDefs = fs.readFileSync(
  `${__dirname}/schema/xpub.graphqls`,
  'utf8',
)
const elifeTypeDefs = fs.readFileSync(
  `${__dirname}/schema/elife.graphqls`,
  'utf8',
)
const entityTypeDefs = [
  fs.readFileSync(`${__dirname}/entities/user/typeDefs.graphqls`, 'utf8'),
]
const typeDefs = `
  ${xpubTypeDefs}
  ${elifeTypeDefs}
  ${entityTypeDefs.join('\n\n')}
`

// merge resolvers
const resolvers = merge({}, require(`./entities/user/resolvers`))

const registerRoutes = app => {
  require(`./entities/user/routes`)(app)
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
  resolvers,
  migrationsPath: `./schema/migrations`,
}
