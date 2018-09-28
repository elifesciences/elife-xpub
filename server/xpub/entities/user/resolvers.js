const jwt = require('jsonwebtoken')
const config = require('config')
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
  Mutation: {
    async exchangeJournalToken(_, { token }) {
      const secret = config.get('pubsweet-server.secret')
      const tokenContents = jwt.verify(token, secret)

      if (tokenContents.iss === 'xpub') {
        throw new Error('Cannot exchange xPub issued token')
      }

      return jwt.sign({ id: tokenContents.id, iss: 'xpub' }, secret, {
        expiresIn: '1d',
      })
    },
  },
}

module.exports = resolvers
