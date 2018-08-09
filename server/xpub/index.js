const { merge } = require('lodash')
const fs = require('fs')

const entities = ['manuscript', 'user']

// concatenate schemas
const xpubTypeDefs = fs.readFileSync(
  `${__dirname}/schema/xpub.graphqls`,
  'utf8',
)
const elifeTypeDefs = fs.readFileSync(
  `${__dirname}/schema/elife.graphqls`,
  'utf8',
)
const entityTypeDefs = entities.map(name =>
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
  ...entities.map(name => require(`./entities/${name}/resolvers`)),
)

module.exports = {
  typeDefs,
  resolvers,
}
