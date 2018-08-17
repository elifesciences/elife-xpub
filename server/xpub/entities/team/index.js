const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = { teamMembers: [] }

const Team = {
  find: dataAccess.selectById,
  new: () => lodash.cloneDeep(empty),
  save: async team => {
    if (team.id) {
      await dataAccess.update(team)
      return team
    }

    const id = await dataAccess.insert(team)
    return { ...team, id }
  },
}

module.exports = Team
