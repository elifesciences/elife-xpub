const os = require('os')
const { merge } = require('lodash')
const fs = require('fs')
const logger = require('@pubsweet/logger')
const cleanup = require('./cleanup').Cleanup
const { AuditLog } = require('@elifesciences/xpub-model')

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
  fs.readFileSync(`${__dirname}/entities/manuscript/typeDefs.graphqls`, 'utf8'),
  fs.readFileSync(`${__dirname}/entities/user/typeDefs.graphqls`, 'utf8'),
]
const typeDefs = `
  ${xpubTypeDefs}
  ${elifeTypeDefs}
  ${entityTypeDefs.join('\n\n')}
`

// merge resolvers
const resolvers = merge(
  {},
  require(`./entities/manuscript/resolvers`),
  require(`./entities/user/resolvers`),
)

const registerRoutes = app => {
  require(`./entities/user/routes`)(app)
  require('./routes')(app)
}

const appMessage = action =>
  `${action} Application: ${os.hostname()}, PID: ${process.pid}`

const auditApplicationEvent = async message => {
  await new AuditLog({
    action: 'APPLICATION',
    objectId: '00000000-0000-0000-0000-000000000000',
    objectType: 'process',
    value: message,
  }).save()
}

const xpubCleanup = async cb => {
  const msg = appMessage('Stopping')
  logger.info(msg)
  // handle the application cleanup in here
  await auditApplicationEvent(msg)
  cb()
}

const stopServer = () => xpubCleanup
const msg = appMessage('Starting')
logger.info(msg)
auditApplicationEvent(msg)

// eslint-disable-next-line no-unused-vars
const cleanupHandler = cleanup(process, logger, stopServer)

module.exports = {
  backend: () => registerRoutes,
  typeDefs,
  resolvers,
  migrationsPath: `./schema/migrations`,
}
