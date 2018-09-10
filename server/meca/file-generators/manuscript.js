const FileManager = require('@elifesciences/xpub-server/entities/file')
const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')

function generateManuscript(manuscript) {
  const fileInfo = ManuscriptManager.getSource(manuscript)
  return FileManager.getContent(fileInfo)
}

module.exports = generateManuscript
