const { logger } = require('@elifesciences/component-logger')

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
    email: {
      recipient: 'xpub-tech-alerts@elifesciences.org',
      subjectPrefix: '[Staging] ',
    },
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
