const { File, Manuscript, User } = require('@elifesciences/xpub-model')
const { S3Storage } = require('@elifesciences/xpub-controller')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(id, userUuid)

  const { stream, filename, mimetype: mimeType } = await file
  let fileEntity = new File({
    manuscriptId: manuscript.id,
    url: `supporting/${id}`,
    filename,
    type: 'SUPPORTING_FILE',
    mimeType,
  })
  await fileEntity.save()
  const fileId = fileEntity.id

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
  await fileEntity.updateStatus('UPLOADED', userUuid)
  // This line is necessary while we are using base-model v1.1.0
  fileEntity = await File.find(fileId)

  try {
    await S3Storage.putContent(fileEntity, fileContents, {})
    await fileEntity.updateStatus('STORED', userUuid)
  } catch (err) {
    await fileEntity.updateStatus('CANCELLED', userUuid)
    await fileEntity.delete()
    throw err
  }

  return Manuscript.find(id, userUuid)
}

module.exports = uploadSupportingFile
