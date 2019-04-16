const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { S3Storage } = require('@elifesciences/component-service-s3')

const { SupportingFiles } = require('../use-cases')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.upload(file)
  const manuscript = await Manuscript.find(id, userUuid)
  return manuscript
}
module.exports = uploadSupportingFile
