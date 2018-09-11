const lodash = require('lodash')
const dataAccess = require('./data-access')

const empty = {
  filename: '',
  label: '',
  type: 0,
  mime_type: '',
  size: 0,
  url: '',
}

const FileManager = {
  find: dataAccess.selectById,
  delete: dataAccess.delete,
  new: () => lodash.cloneDeep(empty),
  save: async file => {
    if (file.id) {
      await dataAccess.update(file)
      return file
    }

    const id = await dataAccess.insert(file)
    return { ...file, id }
  },
  getContent: async file =>
    // TODO get file content from S3
    file.url,
}

module.exports = FileManager
