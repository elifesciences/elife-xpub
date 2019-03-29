const User = require('./entities/user')
const resolvers = require('./entities/user/resolvers')

module.exports = {
  model: User,
  modelName: 'User',
  resolvers,
}
