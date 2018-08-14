const User = require('.')
const elifeApi = require('./helpers/elife-api')

const fetchOrcidDetails = require('@pubsweet-pending/auth-orcid/fetchUserDetails')

const resolvers = {
  Query: {
    async orcidDetails(_, vars, ctx) {
      const user = await User.find(ctx.user)
      return fetchOrcidDetails(user)
    },
    async editors(_, { role }) {
      return elifeApi.people(role)
    },
  },
}

module.exports = resolvers
