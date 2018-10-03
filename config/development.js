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
    // these details are not used but are required to
    // trigger auto migrations when starting pubsweet
    username: 'admin',
    password: 'password',
    email: 'admin@example.com',
    admin: true,
  },

  login: {
    // in development bypass login and use this user
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
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
    apiKey: 'abcd1234',
  },
}
