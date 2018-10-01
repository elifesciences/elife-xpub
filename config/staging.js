const logger = require('./logger')

module.exports = {
  'pubsweet-server': {
    logger,
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
}
