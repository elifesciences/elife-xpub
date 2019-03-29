const User = require('./entities/user')
const resolvers = require('./resolvers')

module.exports = {
  model: User,
  modelName: 'User',
  resolvers,
}
