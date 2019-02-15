const logger = require('./non-serializable/logger')

module.exports = {
  'pubsweet-server': {
    logger,
  },
  server: {
    api: {
      url: 'http://continuumtest--gateway.elife.internal/',
    },
  },
  login: {
    url: 'https://continuumtest--cdn-journal.elifesciences.org/submit',
    enableMock: false,
  },
  mailer: {
    from: 'editorial-staging@elifesciences.org',
    path: `${__dirname}/non-serializable/mailer`,
  },
  meca: {
    notificationEmail: 'xpub-alerts@elifesciences.org',
    subjectEmail: '[Staging] MECA import failed'
  },
  aws: {
    s3: {
      params: {
        Bucket: 'staging-elife-xpub',
      },
    },
  },
  newrelic: {
    licenseKey: 'c7fdeadcfa',
    applicationID: '162979288',
  },
  googleAnalytics: {
    isPublic: true,
    trackingId: 'UA-132441389-2',
  },
  hotJar: {
    id: 1131309,
  },
}
