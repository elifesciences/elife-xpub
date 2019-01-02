const { SupportingFiles, S3Storage } = require('@elifesciences/xpub-controller')

async function removeSupportingFiles(_, id, user) {
  SupportingFiles.remove(S3Storage, _, id, user)
}

module.exports = removeSupportingFiles
