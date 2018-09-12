const S3 = require('aws-sdk/clients/s3')
const config = require('config')

async function uploadToS3(file, id) {
  const s3 = new S3({
    ...config.get('meca.s3'),
    apiVersion: '2006-03-01'
  });

  const params = {
    ...config.get('meca.s3.params'),
    Body: file,
    Key: id
  }

  s3.putObject()
}

module.exports = { uploadToS3 }
