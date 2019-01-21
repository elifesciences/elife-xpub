const logger = require('./non-serializable/logger')

logger.transports.console.level = 'debug'

module.exports = {
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
  aws: {
    s3: {
      params: {
        Bucket: 'end2end-elife-xpub',
      },
    },
  },
}
