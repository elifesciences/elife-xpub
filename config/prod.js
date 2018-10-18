const logger = require('./non-serializable/logger')

module.exports = {
  'pubsweet-server': {
    logger,
  },
  elife: {
    api: {
      url: 'https://api.elifesciences.org/',
    },
  },
  login: {
    url: 'https://elifesciences.org/submit',
    enableMock: false,
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
}
