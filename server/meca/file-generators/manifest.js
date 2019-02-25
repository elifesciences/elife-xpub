const fs = require('fs-extra')

const replaceAll = (template, key, value) =>
  template.replace(new RegExp(`{${key}}`, 'g'), value)
const removeUnicode = str => str.replace(/[^\x00-\x7F]/g, '')

function supplementaryXml(files) {
  const keyList = ['id', 'mimeType', 'filename']
  const fileList = files.filter(
    fileObject => fileObject.type === 'SUPPORTING_FILE',
  )

  let supplementaryFileXml = ''
  const template = fs.readFileSync(
    `${__dirname}/templates/manifest-supplementary-file.xml`,
    'utf8',
  )

  fileList.forEach(file => {
    supplementaryFileXml += keyList.reduce(
      (xml, key) => replaceAll(xml, key, file[key]),
      template,
    )
  })

  return supplementaryFileXml
}

function manifestGenerator(files) {
  if (!Array.isArray(files)) {
    throw new TypeError(`Expecting array: ${typeof files}`)
  }
  const manuscriptFiles = files.filter(
    file => file.type === 'MANUSCRIPT_SOURCE',
  )
  if (manuscriptFiles.length > 1) {
    throw new Error(
      `Could not determine the manuscript, ${JSON.stringify(files, null, 4)}`,
    )
  }
  const manuscript = manuscriptFiles[0]
  const template = fs.readFileSync(
    `${__dirname}/templates/manifest.xml`,
    'utf8',
  )

  const result = template
    .replace('{supplementaryFiles}', supplementaryXml(files))
    .replace('{manuscript.mimeType}', manuscript.mimeType)

  return replaceAll(
    result,
    'manuscript.filename',
    removeUnicode(manuscript.filename),
  )
}

module.exports = {
  manifestGenerator,
  removeUnicode,
}
