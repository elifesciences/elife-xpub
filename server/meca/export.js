const logger = require('@pubsweet/logger')

const articleGenerator = require('./file-generators/article')
const coverLetterGenerator = require('./file-generators/coverLetter')
const disclosureGenerator = require('./file-generators/disclosure')
const manifestGenerator = require('./file-generators/manifest')
const transferGenerator = require('./file-generators/transfer')
const archiveGenerator = require('./file-generators/archive')

const upload = require('./services/upload')

async function generate(manuscript, getContent, clientIp) {
  const manditoryFiles = [
    { name: 'article.xml', content: articleGenerator(manuscript) },
    { name: 'cover_letter.html', content: coverLetterGenerator(manuscript) },
    {
      name: 'disclosure.pdf',
      content: disclosureGenerator(manuscript, clientIp),
    },
    { name: 'manifest.xml', content: manifestGenerator(manuscript.files) },
    { name: 'transfer.xml', content: transferGenerator('') },
  ]

  const uploadedFiles = []

  manuscript.files.forEach(file => {
    if (file.type === 'MANUSCRIPT_SOURCE') {
      uploadedFiles.push({
        name: 'manuscript.pdf',
        content: getContent(file),
      })
    } else if (file.type === 'SUPPORTING_FILE') {
      uploadedFiles.push({
        name: file.filename,
        content: getContent(file),
      })
    }
  })

  return archiveGenerator(manditoryFiles.concat(uploadedFiles))
}

async function mecaExport(manuscript, getContent, clientIp) {
  logger.info(`Starting MECA export`, { manuscriptId: manuscript.id })
  const archive = await generate(manuscript, getContent, clientIp)
  await upload(archive, manuscript.id)
}

module.exports = mecaExport
