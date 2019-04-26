const { DataAccessModel } = require('@elifesciences/component-model')

class Team extends DataAccessModel {
  static get tableName() {
    return 'team'
  }

  static get schema() {
    return {
      required: ['teamMembers', 'role', 'objectId', 'objectType'],
      properties: {
        teamMembers: {
          type: 'array',
          items: { name: { type: 'string' }, email: { type: 'string' } },
        },
        role: { type: 'string' },
        objectId: { type: 'uuid' },
        objectType: { type: 'string' },
      },
    }
  }

  static get jsonAttributes() {
    // tell objection to serialise teamMembers as a postgres array rather than JSON
    return []
  }
}

module.exports = Team
