const AWS = require('aws-sdk')

module.exports = {
  aws: {
    s3: {
      endpoint: new AWS.Endpoint('http://fakes3:4569'),
    },
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
}
