const logger = require('./non-serializable/logger')

module.exports = {
  'pubsweet-server': {
    logger,
  },
  server: {
    api: {
      url: 'http://prod--gateway.elife.internal/',
    },
  },
  login: {
    url: 'https://elifesciences.org/submit',
    enableMock: false,
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
  mailer: {
    from: 'editorial@elifesciences.org',
    path: {
      transport: {
        host: 'localhost',
        port: 25,
      },
    },
  },
  aws: {
    s3: {
      params: {
        Bucket: 'prod-elife-xpub',
      },
    },
  },
  newrelic: {
    licenseKey: 'c53c018d69',
    applicationID: '162983119',
  },
}
