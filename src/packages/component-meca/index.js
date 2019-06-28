const mecaExport = require('./server/meca/export')
const generateDisclosurePdf = require('./server/meca/file-generators/disclosure')
const startSshServer = require('./server/meca/test/mock-sftp-server')

module.exports = {
  mecaExport,
  server: () => require('./server/meca/routes'),
  generateDisclosurePdf,
  startSshServer,
}
