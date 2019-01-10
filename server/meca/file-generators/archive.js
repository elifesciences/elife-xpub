const JsZip = require('jszip')

async function makeZip(files, supportingFiles) {
  const zip = new JsZip()

  await Promise.all(
    Object.entries(files).map(async ([name, file]) => {
      zip.file(name, await file)
    }),
  )

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

module.exports = makeZip
