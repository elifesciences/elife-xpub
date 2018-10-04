const mecaExport = require('./export')

module.exports = {
  mecaExport,
  server: () => require('./routes'),
}
