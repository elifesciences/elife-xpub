#!/usr/bin/env node

const fs = require('fs')
const lockfile = require('@yarnpkg/lockfile')

if (require.main === module) {
  const duplicates = check(process.argv.slice(2))

  if (duplicates.length) {
    console.error(
      `WARNING: Found ${duplicates.length} unexpected duplicated packages`,
    )
    console.info(
      'Use `yarn list --pattern [package name]` to locate the packages',
    )
    console.log(duplicates)
    process.exit(duplicates.length)
  } else {
    console.debug('No unexpected duplicates found')
  }
}

function check(packages) {
  const file = fs.readFileSync('yarn.lock', 'utf8')
  const json = lockfile.parse(file)
  const packageVersions = Object.keys(json.object)

  return packages
    .map(name => {
      const regExp = new RegExp(`^${name}@(.+)`)
      const versions = packageVersions.reduce((vs, spec) => {
        const match = spec.match(regExp)
        const { version } = json.object[spec]
        if (match && !vs.includes(version)) {
          vs.push(version)
        }

        return vs
      }, [])

      return { name, versions }
    })
    .filter(pkg => pkg.versions.length > 1)
}

module.exports = check
