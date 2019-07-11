const logger = require('@elifesciences/component-logger').mockLogger

logger.transports.console.level = 'debug'

module.exports = {
  configTag: 'end2end',
  'pubsweet-server': {
    logger,
  },
  server: {
    api: {
      url: 'http://end2end--gateway.elife.internal/',
    },
  },
  login: {
    url: 'https://end2end--cdn-journal.elifesciences.org/submit',
    enableMock: false,
  },
  hotJar: {
    enabled: false,
  },
  aws: {
    s3: {
      params: {
        Bucket: 'end2end-elife-xpub',
      },
    },
  },
}
