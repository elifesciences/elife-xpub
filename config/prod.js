const logger = require('./non-serializable/logger')

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
