const config = require('config')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
})

class S3Storage {
  static async deleteContent(fileObject) {
    if (!fileObject.id) {
      throw new Error('File has no ID, or is invalid')
    }

    return s3
      .deleteObject({
        Key: `${fileObject.url}/${fileObject.id}`,
      })
      .promise()
  }

  static async putContent(fileObject, content, { size } = {}) {
    if (!fileObject.id) {
      throw new Error('File has no ID, must be saved first')
    }

    return s3
      .putObject({
        Body: content,
        Key: `${fileObject.url}/${fileObject.id}`,
        ContentType: fileObject.mimeType,
        ContentLength: size,
        ACL: 'private',
      })
      .promise()
  }

  static async getContent(fileObject) {
    const { Body } = await s3
      .getObject({ Key: `${fileObject.url}/${fileObject.id}` })
      .promise()
    return Body
  }

  static getDownloadLink(fileObject) {
    return s3.getSignedUrl('getObject', {
      Bucket: config.get('aws.s3.params.Bucket'),
      Key: `${fileObject.url}/${fileObject.id}`,
    })
  }
}

module.exports = S3Storage
