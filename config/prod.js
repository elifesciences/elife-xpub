const { logger } = require('@elifesciences/component-logger')

module.exports = {
  configTag: 'prod',
  'pubsweet-server': {
    logger,
  },
  server: {
    api: {
      url: 'https://prod--cdn-gateway.elifesciences.org/',
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
    isPublic: true,
    demographicSurvey: true,
  },
}
