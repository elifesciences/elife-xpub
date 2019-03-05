const JsZip = require('jszip')
const removeUnicode = require('./removeUnicode')

async function makeZip(files) {
  const zip = new JsZip()

  await Promise.all(
    Object.entries(files).map(async ([, file]) => {
      zip.file(removeUnicode(file.filename, file.index), await file.content)
    }),
  )

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

module.exports = makeZip
