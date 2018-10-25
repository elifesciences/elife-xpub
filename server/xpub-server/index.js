const { merge } = require('lodash')
const fs = require('fs')

const filterFileName = filename => entity =>
  fs.existsSync(`${__dirname}/entities/${entity}/${filename}`)

const entities = ['file', 'identity', 'manuscript', 'team', 'user']

// concatenate schemas
const xpubTypeDefs = fs.readFileSync(
  `${__dirname}/schema/xpub.graphqls`,
  'utf8',
)
const elifeTypeDefs = fs.readFileSync(
  `${__dirname}/schema/elife.graphqls`,
  'utf8',
)

const entityTypeDefs = entities
  .filter(filterFileName('typeDefs.graphqls'))
  .map(name =>
    fs.readFileSync(`${__dirname}/entities/${name}/typeDefs.graphqls`, 'utf8'),
  )
const typeDefs = `
  ${xpubTypeDefs} 
  ${elifeTypeDefs} 
  ${entityTypeDefs.join('\n\n')}
`

// merge resolvers
const resolvers = merge(
  {},
  ...entities
    .filter(filterFileName('resolvers.js'))
    .map(name => require(`./entities/${name}/resolvers.js`)),
)

const registerRoutes = app => {
  entities
    .filter(filterFileName('routes.js'))
    .forEach(name => require(`./entities/${name}/routes.js`)(app))
}

module.exports = {
  backend: () => registerRoutes,
  typeDefs,
  resolvers,
  migrationsPath: `./schema/migrations`,
}
