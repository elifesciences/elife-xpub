const { deferConfig } = require('config/defer')
const winston = require('winston')

winston.level = 'debug'

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    secret: 'not very secret',
    graphiql: true,
    logger: winston,
  },

  dbManager: {
    username: 'admin',
    password: 'password',
    email: 'admin@example.com',
    admin: true,
  },
  'auth-orcid': {
    // get the oauth credentials from another developer or
    // create new ones at https://orcid.org/content/register-client-application-sandbox
    clientID: '',
    clientSecret: '',
    sandbox: true,
  },
}
