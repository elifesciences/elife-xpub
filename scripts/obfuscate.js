const fs = require('fs')
const path = require('path')
const glob = require('glob')
const crypto = require('crypto')
const { replace, includes } = require('lodash')

const rootDir = process.cwd()

// Output from " find | grep http-mocks$ "
const pathHttpMocks = [
  path.join(rootDir, 'test/http-mocks'),
  path.join(rootDir, 'packages/component-meca/server/meca/test/http-mocks'),
]

const md5 = s =>
  crypto
    .createHash('md5')
    .update(s)
    .digest('hex')

/*
 * Walk the tree and replace emailAddresses [.values] by md5'ing
 */
const obfuscateMockFiles = async mockPath => {
  const files = await new Promise((resolve, reject) => {
    glob(path.join(mockPath, '/**/*'), (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  files.forEach(file => {
    if (fs.lstatSync(file).isFile()) {
      const re = new RegExp('"emailAddresses":\\[\\{"value":"([^,]+)",', 'g')
      const content = fs.readFileSync(file).toString()
      fs.writeFileSync(file, obfuscate(content, re))
    }
  })
  console.log(`${mockPath} obfuscated ${files.length} files`)
}

const obfuscateEmail = s => {
  const re = new RegExp('<email>([^<>]+)</email>', 'g')
  return obfuscate(s, re)
}

/*
 * obfuscates a string with a regular expression defining what needs to be
 * hashed and replaced.
 */
const obfuscate = (s, re) => {
  let m
  const matches = []
  do {
    m = re.exec(s)
    if (m) {
      matches.push({ str: m[1], index: m.index })
    }
  } while (m)

  let newStr = s

  matches.forEach(item => {
    // make sure this is idempotent
    if (includes(item.str, '.') && includes(item.str, '@')) {
      newStr = replace(newStr, item.str, md5(item.str))
    }
  })
  return newStr
}

/*
 * If run from the terminal then execute obfuscateMockFiles()
 */
if (require.main === module) {
  pathHttpMocks.map(mockPath => obfuscateMockFiles(mockPath))
}

module.exports = {
  obfuscateEmail,
}
