const config = require('config')
const { User } = require('@elifesciences/xpub-model')
const { Manuscript, S3Storage, ScienceBeamApi } = require('@elifesciences/xpub-controller')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')

async function uploadManuscript(_, { file, id, fileSize }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const ms = new Manuscript(
    config,
    userUuid,
    S3Storage,
    ScienceBeamApi,
    pubsubManager,
  )
  return ms.upload(id, file, fileSize)
}

module.exports = uploadManuscript
