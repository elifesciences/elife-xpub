const fs = require('fs')
const path = require('path')

const Manuscript = require('./entities/manuscript')

module.exports = {
  model: Manuscript,
  modelName: 'Manuscript',
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
