const fs = require('fs')
const path = require('path')

const Team = require('./entities/team')

module.exports = {
  model: Team,
  modelName: 'Team',
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
