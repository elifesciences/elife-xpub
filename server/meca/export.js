const logger = require('@pubsweet/logger')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')
const {
  manifestGenerator,
  removeUnicode,
} = require('./file-generators/manifest')

const upload = require('./services/upload')

async function generate(manuscript, getContent, clientIp) {
  const uploadedFiles = manuscript.files.map(file => ({
    name: removeUnicode(file.filename),
    content: getContent(file),
    type: file.type,
  }))

  const manditoryFiles = [
    { name: 'article.xml', content: articleGenerator(manuscript) },
    { name: 'cover_letter.html', content: coverLetterGenerator(manuscript) },
    {
      name: 'disclosure.pdf',
      content: disclosureGenerator(manuscript, clientIp),
    },
    { name: 'manifest.xml', content: manifestGenerator(uploadedFiles) },
    { name: 'transfer.xml', content: transferGenerator('') },
  ]

  const allFiles = manditoryFiles.concat(uploadedFiles)
  return archiveGenerator(allFiles)
}

async function mecaExport(manuscript, getContent, clientIp) {
  logger.info(`Starting MECA export`, { manuscriptId: manuscript.id })
  const archive = await generate(manuscript, getContent, clientIp)
  await upload(archive, manuscript.id)
}

module.exports = mecaExport
