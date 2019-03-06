const BaseModel = require('@pubsweet/base-model')

class AuditLog extends BaseModel {
  static get tableName() {
    return 'semantic_extraction'
  }

  static get schema() {
    return {
      required: ['manuscriptId', 'fieldName', 'value'],
      properties: {
        manuscriptId: { type: 'uuid' },
        fieldName: { type: 'string' },
        value: { type: 'string' },
      },
    }
  }

  async delete() {
    throw new Error('Unsupported operation')
  }
}

module.exports = AuditLog
