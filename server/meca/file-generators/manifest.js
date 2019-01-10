const fs = require('fs-extra')

function supplementaryXml(files) {
  const keyList = ['id', 'mimeType', 'filename']
  const fileList = files.filter(
    fileObject => fileObject.type === 'SUPPORTING_FILE',
  )

  let supplementaryFileXml = ''
  const template = fs.readFileSync(
    `${__dirname}/manifest-supplementary-file.xml`,
    'utf8',
  )

  fileList.forEach(file => {
    supplementaryFileXml += keyList.reduce(
      (xml, key) => xml.replace(new RegExp(`{${key}}`, 'g'), file[key]),
      template,
    )
  })

  return supplementaryFileXml
}

function manifestXml(suppFilesXml) {
  const template = fs.readFileSync(`${__dirname}/manifest.xml`, 'utf8')
  const xml = template.replace('{supplementaryFiles}', suppFilesXml)

  return xml
}

function generateManifest(files) {
  if (!Array.isArray(files)) {
    throw TypeError(`Expecting array: ${typeof files}`)
  }

  return manifestXml(supplementaryXml(files))
}

module.exports = generateManifest
