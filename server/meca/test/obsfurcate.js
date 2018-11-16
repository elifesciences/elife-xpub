const fs = require('fs')
const glob = require('glob')
const crypto = require('crypto')
const { replace } = require('lodash')

const md5 = s =>
  crypto
    .createHash('md5')
    .update(s)
    .digest('hex')

/*
 * Walk the tree and replace emailAddresses [.values] by md5'ing
 */
const obsforcateMockFiles = async () => {
  const files = await new Promise((resolve, reject) => {
    glob(`${process.cwd()}/http-mocks/**/*`, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  files.forEach(file => {
    if (fs.lstatSync(file).isFile()) {
      const re = new RegExp('"emailAddresses":\\[\\{"value":"([^,]+)",', 'g')
      const content = fs.readFileSync(file).toString()
      fs.writeFileSync(`${file}-X`, obsforcate(content, re))
    }
  })
}

const obsfurcateEmail = s => {
  const re = new RegExp('<email>([^<>]+)</email>', 'g')
  return obsforcate(s, re)
}

/*
 * Obsforcates a string with a regular expression defining what needs to be
 * hashed and replaced.
 */
const obsforcate = (s, re) => {
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
    newStr = replace(newStr, item.str, md5(item.str))
  })
  return newStr
}

/*
 * If run from the terminal then execute obsforcateMockFiles()
 */
if (require.main === module) {
  obsforcateMockFiles()
}

module.exports = {
  obsforcateMockFiles,
  obsfurcateEmail,
  md5,
}
