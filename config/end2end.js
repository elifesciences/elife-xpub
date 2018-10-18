const logger = require('./non-serializable/logger')

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
  elife: {
    api: {
      url: 'https://end2end--gateway.elifesciences.org/',
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
