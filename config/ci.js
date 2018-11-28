const AWS = require('aws-sdk')

module.exports = {
  aws: {
    s3: {
      endpoint: new AWS.Endpoint(
        // randomise port to avoid conflicts in parallel test runs
        `http://localhost:${Math.floor(Math.random() * 50000) + 15000}`,
      ),
    },
  },
  meca: {
    sftp: {
      disableUpload: true,
    },
  },
}
