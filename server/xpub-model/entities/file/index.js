const BaseModel = require('@pubsweet/base-model')

class AbstractFile extends BaseModel {
  get storage() {
    throw Error('Not Implemented')
  }

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

    return this.storage
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
    const { Body } = await this.storage
      .getObject({ Key: `${this.url}/${this.id}` })
      .promise()
    return Body
  }

  static async find(id) {
    const file = await this.find(id)

    return file
  }

  static async findByManuscriptId(manuscriptId) {
    const files = await this.query().where({
      manuscript_id: manuscriptId,
    })
    if (!files) {
      throw new Error(`file with manuscript_id ${manuscriptId} not found`)
    }
    return files
  }

  async deleteContent() {
    if (!this.id) {
      throw new Error('File has no ID, or is invalid')
    }

    return this.storage
      .deleteObject({
        Key: `${this.url}/${this.id}`,
      })
      .promise()
  }
}

module.exports = AbstractFile
