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
}
