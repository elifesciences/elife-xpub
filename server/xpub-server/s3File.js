const config = require('config')
const AWS = require('aws-sdk')
const { AbstractFile } = require('@elifesciences/xpub-model')

const s3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

class S3File extends AbstractFile {
  static getStorage() {
    return s3
  }
}

module.exports = S3File
