const fs = require('fs-extra')

async function generateManifest() {
  return fs.readFile(`${__dirname}/manifest.xml`, 'utf8')
}

module.exports = generateManifest
