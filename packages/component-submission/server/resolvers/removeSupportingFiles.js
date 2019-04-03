const { S3Storage } = require('@elifesciences/component-services')
const User = require('@elifesciences/component-model-user').model

const { SupportingFiles } = require('../use-cases')

async function removeSupportingFiles(_, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.removeAll()
}

module.exports = removeSupportingFiles
