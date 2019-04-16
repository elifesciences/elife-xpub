const config = require('config')
const User = require('@elifesciences/component-model-user').model
const { S3Storage } = require('@elifesciences/component-service-s3')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')
const ScienceBeamApi = require('../services/scienceBeamApi')
const { Manuscript } = require('../use-cases')

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
