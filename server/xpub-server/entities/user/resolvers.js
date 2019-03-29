const jwt = require('jsonwebtoken')
const config = require('config')
const elifeApi = require('@elifesciences/component-model-user/entities/user/helpers/elife-api')

const resolvers = {
  Query: {
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
  Identity: {
    __resolveType(identity) {
      switch (identity.type) {
        case 'elife':
          return 'ElifeIdentity'
        default:
          return null
      }
    },
  },
}

module.exports = resolvers
