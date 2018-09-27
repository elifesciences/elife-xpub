const { deferConfig } = require('config/defer')
const AWS = require('aws-sdk')

module.exports = {
  'pubsweet-server': {
    db: {
      database: 'test',
      idleTimeoutMillis: 800, // Stops open handles in tests
    },
    port: 4000,
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    uploads: 'test/temp/uploads',
    secret: 'test',
  },
  login: {
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
  },
  meca: {
    s3: {
      params: {
        Bucket: 'test',
      },
      connectionOptions: {
        endpoint: new AWS.Endpoint('http://localhost:4578'),
        s3ForcePathStyle: true,
        region: 'eu-west-1',
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
      disableUpload: false,
    },
    sftp: {
      connectionOptions: {
        host: 'localhost',
        port: 3022,
        username: 'test',
        password: 'tset',
      },
      remotePath: '/test',
      disableUpload: false,
    },
    notificationEmail: 'test@example.com',
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
