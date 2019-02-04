const { SupportingFiles, S3Storage } = require('@elifesciences/xpub-controller')
const { User } = require('@elifesciences/xpub-model')

async function removeSingleSupportingFile(
  _,
  { manuscriptId, fileId },
  { user },
) {
  const userUuid = await User.getUuidForProfile(user)
  const files = new SupportingFiles(S3Storage, manuscriptId, userUuid)
  await files.removeFile(manuscriptId, fileId)
}

module.exports = removeSingleSupportingFile
