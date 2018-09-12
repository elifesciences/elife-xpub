const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const manuscriptGenerator = require('./file-generators/manuscript')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

const upload = require('./upload')

async function generate(manuscriptId, userId, clientIp) {
  const manuscript = await ManuscriptManager.find(manuscriptId, userId)

  return archiveGenerator({
    'article.xml': articleGenerator(manuscript),
    'cover_letter.html': coverLetterGenerator(manuscript),
    'disclosure.pdf': disclosureGenerator(manuscript, clientIp),
    'manifest.xml': manifestGenerator(),
    'manuscript.pdf': manuscriptGenerator(manuscript),
    'transfer.xml': transferGenerator(''), // auth code not currently used
  })
}

async function send(manuscriptId, userId, clientIp) {
  const archive = await generate(manuscriptId, userId, clientIp)
  await upload(archive, manuscriptId)
}

module.exports = mecaExport
