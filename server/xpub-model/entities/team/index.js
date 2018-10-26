const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = { teamMembers: [] }

const Team = {
  find: dataAccess.selectById,
  delete: dataAccess.delete,
  new: () => lodash.cloneDeep(empty),
  save: async team => {
    let id = { team }
    if (team.id) {
      const updated = await dataAccess.update(team)
      if (!updated) {
        throw new Error('Team not found')
      }
    } else {
      id = await dataAccess.insert(team)
    }

    return { ...team, id }
  },
}

module.exports = Team
