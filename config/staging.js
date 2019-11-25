const { logger } = require('@elifesciences/component-logger')

module.exports = {
  configTag: 'staging',
  'pubsweet-server': {
    logger,
  },
  server: {
    api: {
      url: 'http://continuumtest--gateway.elife.internal/',
    },
  },
  login: {
    url: 'https://continuumtestpreview--journal.elifesciences.org/submit',
    enableMock: false,
    sessionTTL: 300000,
  },
  logout: {
    redirectUrl:
      'https://continuumtestpreview--journal.elifesciences.org/log-out',
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
  staffIds: [
    '0000-0003-3830-8230',
    '0000-0003-3931-8713',
    '0000-0001-8393-3153',
    '0000-0003-3621-6260',
    '0000-0002-2174-109X',
    '0000-0001-5852-0218',
    '0000-0002-9971-813X',
    '0000-0002-6949-8586',
    '0000-0001-9570-2061',
    '0000-0002-8141-5886',
    '0000-0002-4131-444X',
    '0000-0002-9556-5738',
  ],
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
  features: {
    isPublic: true,
    demographicSurvey: true,
  },
}
