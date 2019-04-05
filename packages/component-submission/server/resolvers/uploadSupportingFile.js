const config = require('config')
const User = require('@elifesciences/component-model-user').model
const { S3Storage } = require('@elifesciences/component-service-s3')
const { SupportingFiles, Manuscript } = require('../use-cases')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.upload(file)

  const manuscript = new Manuscript(config, userUuid, S3Storage)

  return manuscript.getView(id)
}
module.exports = uploadSupportingFile
