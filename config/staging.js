const logger = require('./non-serializable/logger')

module.exports = {
  'pubsweet-server': {
    logger,
  },
  elife: {
    api: {
      url: 'https://continuumtest--gateway.elifesciences.org/',
    },
  },
  login: {
    url: 'https://continuumtest--journal.elifesciences.org/submit',
    enableMock: false,
  },
}
