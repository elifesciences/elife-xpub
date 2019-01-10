const logger = require('@pubsweet/logger')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

const upload = require('./services/upload')

// const files = new SupportingFiles(dummyStorage, manuscript.id, userId)

async function generate(manuscript, getContent, clientIp) {
  let content = ''
  manuscript.files.forEach(file => {
    if (file.type === 'MANUSCRIPT_SOURCE') {
      content = getContent(file)
    }
  })

  return archiveGenerator({
    'article.xml': articleGenerator(manuscript),
    'cover_letter.html': coverLetterGenerator(manuscript),
    'disclosure.pdf': disclosureGenerator(manuscript, clientIp),
    'manifest.xml': manifestGenerator(manuscript.files),
    'manuscript.pdf': content,
    'transfer.xml': transferGenerator(''), // auth code not currently used
  })
}

async function mecaExport(manuscript, getContent, clientIp) {
  logger.info(`Starting MECA export`, { manuscriptId: manuscript.id })
  const archive = await generate(manuscript, getContent, clientIp)
  await upload(archive, manuscript.id)
}

module.exports = mecaExport
