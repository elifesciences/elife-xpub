const { mockLogger } = require('@elifesciences/component-logger')

mockLogger.transports.console.level = 'debug'

module.exports = {
  'pubsweet-server': {
    mockLogger,
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
