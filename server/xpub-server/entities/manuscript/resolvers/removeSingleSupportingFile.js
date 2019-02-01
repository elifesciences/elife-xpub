const { SupportingFiles, S3Storage } = require('@elifesciences/xpub-controller')
const { User } = require('@elifesciences/xpub-model')

async function removeSingleSupportingFile(_, { manuscriptId, fileId }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  console.log('removing supporting file......')
  console.log(manuscriptId)
  console.log(fileId)
  console.log('userId', userUuid)
  console.log('++++++++++++++++')
  // console.log(file)
  const files = new SupportingFiles(S3Storage, manuscriptId, userUuid)
  console.log(files)
  await files.removeFile(manuscriptId, fileId)
}

module.exports = removeSingleSupportingFile