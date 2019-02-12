const { Manuscript, User } = require('@elifesciences/xpub-model')
const { S3Storage, SupportingFiles } = require('@elifesciences/xpub-controller')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, id, userUuid)
  await files.upload(file)
  const manuscript = await Manuscript.find(id, userUuid)
  return manuscript
}
module.exports = uploadSupportingFile
