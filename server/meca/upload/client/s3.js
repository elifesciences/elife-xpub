const AWS = require('aws-sdk')
const config = require('config')

const S3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

module.exports = S3
