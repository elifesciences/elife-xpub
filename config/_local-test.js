const { deferConfig } = require('config/defer')
const AWS = require('aws-sdk')
const logger = require('@elifesciences/component-logger').mockLogger

module.exports = {
  configTag: 'test',
  'pubsweet-server': {
    db: {
      database: 'test',
      idleTimeoutMillis: 800, // Stops open handles in tests
    },
    port: 3000,
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
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
      endpoint: new AWS.Endpoint('http://localhost:4569/'),
    },
  },
  fileUpload: {
    maxSizeMB: 10,
  },
  server: {
    api: {
      secret: '',
      url: 'http://localhost:8080/',
    },
  },
  meca: {
    sftp: {
      connectionOptions: {
        host: 'localhost',
        port: 22,
        username: 'test',
        password: 'tset',
      },
      remotePath: '/upload',
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
}
