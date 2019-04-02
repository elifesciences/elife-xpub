const fs = require('fs')
const path = require('path')

const User = require('./entities/user')
const resolvers = require('./resolvers')

module.exports = {
  model: User,
  modelName: 'User',
  resolvers,
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
