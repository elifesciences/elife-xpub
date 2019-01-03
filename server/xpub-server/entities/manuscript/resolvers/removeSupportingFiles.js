const { SupportingFiles, S3Storage } = require('@elifesciences/xpub-controller')

async function removeSupportingFiles(_, id, user) {
  const files = new SupportingFiles(S3Storage, id, user)
  await files.removeAll()
}

module.exports = removeSupportingFiles
