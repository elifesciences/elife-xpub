const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')
const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const manuscriptGenerator = require('./file-generators/manuscript')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

async function generate(manuscriptId, clientIp) {
  const manuscript = await ManuscriptManager.find(manuscriptId)

  return archiveGenerator({
    'article.xml': articleGenerator(manuscript),
    'cover_letter.html': coverLetterGenerator(manuscript),
    'disclosure.pdf': disclosureGenerator(manuscript, clientIp),
    'manifest.xml': manifestGenerator(),
    'manuscript.pdf': manuscriptGenerator(manuscript),
    'transfer.xml': transferGenerator(),
  })
}

module.exports = { generate }
