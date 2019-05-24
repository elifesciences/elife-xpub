const { deferConfig } = require('config/defer')
const winston = require('winston')
const path = require('path')

winston.level = 'debug'

module.exports = {
  configTag: 'development',
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
    watchDirectory: path.resolve(__dirname, '..', 'packages'),
  },

  aws: {
    credentials: {
      region: 'eu-west-1',
      accessKeyId: 'test',
      secretAccessKey: 'dev',
    },
    s3: {
      params: {
        Bucket: 'test-bucket',
      },
    },
  },
  meca: {
    s3: {
      remotePath: 'localhost',
      disableUpload: false,
    },
    sftp: {
      disableUpload: true,
    },
    apiKey: 'abcd1234',
  },
  hotJar: {
    enabled: false,
  },
}
