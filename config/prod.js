const { logger } = require('@elifesciences/component-logger')

module.exports = {
  configTag: 'prod',
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
  logout: {
    redirectUrl: 'https://elifesciences.org/log-out',
  },
  meca: {
    email: {
      recipient: 'xpub-tech-alerts@elifesciences.org',
      subjectPrefix: '[Production] ',
    },
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
  features: {
    demographicSurvey: false,
  },
}
