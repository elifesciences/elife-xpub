const config = require('config')
const AWS = require('aws-sdk')
const BaseModel = require('@pubsweet/base-model')

const s3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

class File extends BaseModel {
  static get tableName() {
    return 'file'
  }

  static get schema() {
    return {
      properties: {
        manuscriptId: { type: 'uuid' },
        filename: { type: 'string' },
        label: { type: ['string', 'null'] },
        type: { type: ['string', 'null'] },
        mimeType: { type: ['string', 'null'] },
        size: { type: ['string', 'null'] },
        url: { type: 'string' },
      },
    }
  }

  async putContent(content, { size } = {}) {
    if (!this.id) {
      throw new Error('File has no ID, must be saved first')
    }

    return s3
      .putObject({
        Body: content,
        Key: `${this.url}/${this.id}`,
        ContentType: this.mimetype,
        ContentLength: size,
        ACL: 'private',
      })
      .promise()
  }

  async getContent() {
    const { Body } = await s3
      .getObject({ Key: `${this.url}/${this.id}` })
      .promise()
    return Body
  }
}

module.exports = File
