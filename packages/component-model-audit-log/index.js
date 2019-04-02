const fs = require('fs')
const path = require('path')

const AuditLog = require('./entities/auditLog')

module.exports = {
  model: AuditLog,
  modelName: 'AuditLog',
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
