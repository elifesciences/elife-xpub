const { Manuscript, User } = require('@elifesciences/xpub-model')
const { File } = require('@elifesciences/xpub-model')
const { S3Storage } = require('@elifesciences/xpub-controller')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(id, userUuid)

  const { stream, filename, mimetype: mimeType } = await file
  const fileEntity = await new File({
    manuscriptId: manuscript.id,
    url: `supporting/${id}`,
    filename,
    type: 'SUPPORTING_FILE',
    mimeType,
  }).save()

  const fileContents = await new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => {
      chunks.push(chunk)
    })
    stream.on('error', reject)
    stream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
  })
  await File.updateStatus(fileEntity.id, 'UPLOADED')

  try {
    await S3Storage.putContent(fileEntity, fileContents, {})
    await File.updateStatus(fileEntity.id, 'STORED')
  } catch (err) {
    await File.updateStatus(fileEntity.id, 'CANCELLED')
    await fileEntity.delete()
    throw err
  }

  return Manuscript.find(id, userUuid)
}

module.exports = uploadSupportingFile
