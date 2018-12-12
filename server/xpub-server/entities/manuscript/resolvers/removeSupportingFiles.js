const { S3Storage } = require('@elifesciences/xpub-server')
const { controller } = require('@elifesciences/xpub-controller')

async function removeSupportingFiles(_, id, user) {
  controller(S3Storage, _, id, user)
}

module.exports = removeSupportingFiles
