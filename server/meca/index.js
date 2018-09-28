const logger = require('@pubsweet/logger')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

const upload = require('./upload')

async function generate(manuscript, content, clientIp) {
  return archiveGenerator({
    'article.xml': articleGenerator(manuscript),
    'cover_letter.html': coverLetterGenerator(manuscript),
    'disclosure.pdf': disclosureGenerator(manuscript, clientIp),
    'manifest.xml': manifestGenerator(),
    'manuscript.pdf': content,
    'transfer.xml': transferGenerator(''), // auth code not currently used
  })
}

async function mecaExport(manuscript, content, clientIp) {
  logger.info(`Starting meca export for manuscript ${manuscript}`)
  const archive = await generate(manuscript, content, clientIp)
  await upload(archive, manuscript.id)
}

module.exports = mecaExport
