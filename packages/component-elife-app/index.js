const fs = require('fs')
const path = require('path')
const resolvers = require('./server/resolvers')

module.exports = {
  server: () => require('./server/routes'),
  resolvers,
  typeDefs: fs.readFileSync(
    path.join(__dirname, '/server/typeDefs.graphqls'),
    'utf8',
  ),
}
