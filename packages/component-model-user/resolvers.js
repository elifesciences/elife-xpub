const User = require('./entities/user')

const resolvers = {
  Query: {
    async currentUser(_, vars, ctx) {
      if (!ctx.user) return null
      // This is bad!! It's a query -- it shouldn't mutate the application state!!!
      return User.findOrCreate(ctx.user)
    },
  },
}

module.exports = resolvers
