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
  },
}
