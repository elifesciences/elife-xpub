const fs = require('fs')
const path = require('path')
const resolvers = require('./server/resolvers')

module.exports = {
  resolvers,
  typeDefs: fs.readFileSync(
    path.join(__dirname, '/server/typeDefs.graphqls'),
    'utf8',
  ),
}
