const AWS = require('aws-sdk')
const config = require('config')

const S3 = new AWS.S3({
  ...config.get('meca.s3.connectionOptions'),
  apiVersion: '2006-03-01',
})

module.exports = S3
