const { S3Storage } = require('@elifesciences/component-service-s3')
const { User } = require('@pubsweet/models')

const { SupportingFiles } = require('../use-cases')

async function removeSupportingFiles(_, { id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.removeAll()
}

module.exports = removeSupportingFiles
