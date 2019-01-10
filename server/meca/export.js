const logger = require('@pubsweet/logger')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

const upload = require('./services/upload')

async function generate(manuscript, getContent, clientIp) {
  let content = ''
  const supportingFiles = {}

  manuscript.files.forEach(file => {
    if (file.type === 'MANUSCRIPT_SOURCE') {
      content = getContent(file)
    } else if (file.type === 'SUPPORTING_FILE') {
      supportingFiles[file.filename] = getContent(file)
    }
  })

  const manditoryFiles = {
    'article.xml': articleGenerator(manuscript),
    'cover_letter.html': coverLetterGenerator(manuscript),
    'disclosure.pdf': disclosureGenerator(manuscript, clientIp),
    'manifest.xml': manifestGenerator(manuscript.files),
    'manuscript.pdf': content,
    'transfer.xml': transferGenerator(''), // auth code not currently used
  }

  return archiveGenerator({ ...manditoryFiles, ...supportingFiles })
}

async function mecaExport(manuscript, getContent, clientIp) {
  logger.info(`Starting MECA export`, { manuscriptId: manuscript.id })
  const archive = await generate(manuscript, getContent, clientIp)
  await upload(archive, manuscript.id)
}

module.exports = mecaExport
