const AWS = require('aws-sdk')
const config = require('config')

const S3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

// TODO
const params = {};

S3.putObject(params).promise()
  .then(() => {
    console.log('Successfully uploaded to S3.')
    process.exit(0)
  })
  .catch((err) => {
    console.log('Failed to upload to S3')
    console.error(err)
    process.exit(1)
  })
