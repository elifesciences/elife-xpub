const { deferConfig } = require('config/defer')
const winston = require('winston')
const path = require('path')

winston.level = 'debug'

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    hostname: 'localhost',
    secret: 'not very secret',
    graphiql: true,
    logger: winston,
    morganLogFormat:
      ':method :url :status :graphql[operation] :res[content-length] :response-time ms',
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

  forever: {
    watchDirectory: path.resolve(__dirname, '..', 'server'),
  },

  meca: {
    s3: {
      disableUpload: true,
    },
    sftp: {
      disableUpload: true,
    },
  },
}
