const { DataAccessModel } = require('@elifesciences/component-model')

class Identity extends DataAccessModel {
  static get tableName() {
    return 'identity'
  }

  static get schema() {
    return {
      required: ['userId', 'type', 'identifier'],
      properties: {
        type: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        email: { type: 'string' },
        aff: { type: 'string' },
        identifier: { type: 'uuid' },
        userId: { type: 'uuid' },
        meta: {
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
      },
    }
  }
}

module.exports = Identity
