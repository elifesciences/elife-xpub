const BaseModel = require('@pubsweet/base-model')

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
}

module.exports = File
