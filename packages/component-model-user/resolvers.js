const User = require('./index').model

const resolvers = {
  Query: {
    async currentUser(_, vars, ctx) {
      if (!ctx.user) return null
      return User.findOrCreate(ctx.user)
    },
  },
}

module.exports = resolvers
