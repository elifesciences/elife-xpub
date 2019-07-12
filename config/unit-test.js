const { deferConfig } = require('config/defer')
const AWS = require('aws-sdk')
const logger = require('@elifesciences/component-logger').mockLogger

module.exports = {
  'pubsweet-server': {
    db: {
      database: 'test',
      idleTimeoutMillis: 800, // Stops open handles in tests
    },
    port: 3000,
    baseUrl: deferConfig(cfg => `http://app:${cfg['pubsweet-server'].port}`),
    uploads: 'test/temp/uploads',
    secret: 'test',
    logger,
  },
  login: {
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
  },
  aws: {
    credentials: {
      region: 'eu-west-1',
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
    s3: {
      params: {
        Bucket: 'test',
      },
      endpoint: new AWS.Endpoint(
        // randomise port to avoid conflicts in parallel test runs
        `http://localhost:${Math.floor(Math.random() * 50000) + 15000}`,
      ),
    },
  },
  fileUpload: {
    maxSizeMB: 10,
  },
  meca: {
    sftp: {
      connectionOptions: {
        host: 'localhost',
        port: 3022,
        username: 'test',
        password: 'tset',
      },
      remotePath: '/test',
    },
    apiKey: 'abcd1234',
    email: {
      recipient: 'test@example.com',
    },
  },
  mailer: {
    transport: {
      sendmail: false,
      port: 1025,
      auth: {
        user: 'user',
        pass: 'pass',
      },
    },
  },
  features: {
    isPublic: true,
    demographicSurvey: false,
  },
}
