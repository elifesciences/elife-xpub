const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = {}

const IdentityManager = {
  find: dataAccess.selectById,
  delete: dataAccess.delete,
  new: () => lodash.cloneDeep(empty),
  save: async identity => {
    if (identity.id) {
      await dataAccess.update(identity)
      return identity
    }

    const id = await dataAccess.insert(identity)
    return { ...identity, id }
  },
}

module.exports = IdentityManager
