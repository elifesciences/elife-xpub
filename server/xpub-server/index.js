const { merge } = require('lodash')
const fs = require('fs')
const S3Storage = require('./s3Storage')

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

module.exports = {
  backend: () => registerRoutes,
  typeDefs,
  resolvers,
  migrationsPath: `./schema/migrations`,
  S3Storage,
}
