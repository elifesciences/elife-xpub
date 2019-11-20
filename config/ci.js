const AWS = require('aws-sdk')

module.exports = {
  configTag: 'ci',
  aws: {
    s3: {
      endpoint: new AWS.Endpoint('http://localhost:4569'),
    },
  },
  login: {
    sessionTTL: 300000,
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
  googleAnalytics: {
    debug: true,
  },
}
