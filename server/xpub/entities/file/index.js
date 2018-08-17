const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = { teamMembers: [] }

const FileManager = {
  find: dataAccess.selectById,
  new: () => lodash.cloneDeep(empty),
  save: async file => {
    if (file.id) {
      await dataAccess.update(file)
      return file
    }

    const id = await dataAccess.insert(file)
    return { ...file, id }
  },
}

module.exports = FileManager
