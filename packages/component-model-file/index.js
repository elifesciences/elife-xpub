const fs = require('fs')
const path = require('path')

const File = require('./entities/file')

module.exports = {
  model: File,
  modelName: 'File',
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
