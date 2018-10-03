const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = {}

const IdentityManager = {
  find: dataAccess.selectById,
  delete: dataAccess.delete,
  new: () => lodash.cloneDeep(empty),
  save: async identity => {
    let id = { identity }
    if (identity.id) {
      const updated = await dataAccess.update(identity)
      if (!updated) {
        throw new Error('Identity not found')
      }
    } else {
      id = await dataAccess.insert(identity)
    }

    return { ...identity, id }
  },
}

module.exports = IdentityManager
