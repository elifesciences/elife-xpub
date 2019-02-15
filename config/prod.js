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
    email: {
      recipient: 'xpub-alerts@elifesciences.org',
      subject: '[Production] MECA import failed'
    }
  },
  mailer: {
    from: 'editorial@elifesciences.org',
    path: `${__dirname}/non-serializable/mailer`,
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
  googleAnalytics: {
    isPublic: true,
    trackingId: 'UA-132441389-1',
  },
  hotJar: {
    id: 443270,
  },
}
