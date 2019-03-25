const { SupportingFiles } = require('@elifesciences/xpub-controller')
const { S3Storage } = require('@elifesciences/xpub-client')
const { User } = require('@elifesciences/component-model')

async function removeSupportingFiles(_, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.removeAll()
}

module.exports = removeSupportingFiles
