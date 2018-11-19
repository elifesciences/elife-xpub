const logger = require('./non-serializable/logger')

logger.transports.console.level = 'debug'

module.exports = {
  'pubsweet-server': {
    logger,
  },
  // TODO: should point to a local ftp server if that will be covered by a test?
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
  server: {
    api: {
      url: 'http://end2end--gateway.elife.internal/',
    },
  },
  login: {
    url: 'https://end2end--journal.elifesciences.org/submit',
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
