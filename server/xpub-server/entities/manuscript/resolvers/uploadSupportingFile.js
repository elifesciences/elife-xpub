const { Manuscript, User } = require('@elifesciences/xpub-model')
const { S3File } = require('@elifesciences/xpub-server')

async function uploadSupportingFile(_, { file, id }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const manuscript = await Manuscript.find(id, userUuid)

  const { stream, filename } = await file
  const fileEntity = await new S3File({
    manuscriptId: manuscript.id,
    url: `supporting/${id}`,
    filename,
    type: 'SUPPORTING_FILE',
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

  try {
    await fileEntity.putContent(fileContents, {})
  } catch (err) {
    await fileEntity.delete()
    throw err
  }

  manuscript.files.push(fileEntity)
  await manuscript.save()

  return manuscript
}

module.exports = uploadSupportingFile
