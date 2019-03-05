const BaseModel = require('@pubsweet/base-model')

class AuditLog extends BaseModel {
  static get tableName() {
    return 'audit_log'
  }

  static get schema() {
    return {
      required: ['action', 'objectId'],
      properties: {
        userId: { type: 'uuid' }, // Currently not used
        action: {
          type: 'string',
          enum: ['CREATED', 'UPDATED', 'DELETED', 'MECA_RESULT'],
        },
        value: { type: ['string', 'null'] },
        objectId: { type: 'uuid' },
        objectType: { type: ['string', 'null'] },
      },
    }
  }

  async delete() {
    throw new Error('Unsupported operation')
  }
}

module.exports = AuditLog
