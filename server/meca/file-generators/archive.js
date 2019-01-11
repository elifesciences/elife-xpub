const JsZip = require('jszip')

async function makeZip(files) {
  const zip = new JsZip()

  await Promise.all(
    Object.entries(files).map(async ([, file]) => {
      zip.file(file.name, await file.content)
    }),
  )

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

module.exports = makeZip
