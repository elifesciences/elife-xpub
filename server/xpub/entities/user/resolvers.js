const UserManager = require('.')
const elifeApi = require('./helpers/elife-api')

const resolvers = {
  Query: {
    async orcidDetails(_, vars, ctx) {
      const user = await UserManager.findByProfileId(ctx.user)
      const identity = user.identities[0]
      return {
        firstName: identity.meta.firstName,
        lastName: identity.meta.lastName,
        email: identity.email,
        aff: identity.meta.affiliation,
      }
    },
    async currentUser(_, vars, ctx) {
      if (!ctx.user) return null
      return UserManager.findOrCreate(ctx.user)
    },
    async editors(_, { role }) {
      return elifeApi.people(role)
    },
  },
}

module.exports = resolvers
