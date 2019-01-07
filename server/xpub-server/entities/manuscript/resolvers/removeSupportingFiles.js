const { SupportingFiles, S3Storage } = require('@elifesciences/xpub-controller')
const { User } = require('@elifesciences/xpub-model')

async function removeSupportingFiles(_, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.removeAll()
}

module.exports = removeSupportingFiles
