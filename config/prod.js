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
  aws: {
    s3: {
      params: {
        Bucket: 'prod-elife-xpub',
      },
    },
  },
}
