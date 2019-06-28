const config = require('config')
const models = require('@pubsweet/models')
const { S3Storage } = require('@elifesciences/component-service-s3')
const pubsubManager = require('pubsweet-server/src/graphql/pubsub')
const ScienceBeamApi = require('../services/scienceBeamApi')
const { Manuscript } = require('../use-cases')
const { Submission } = require('../aggregates')

async function uploadManuscript(_, { file, id, fileSize }, { user }) {
  const userUuid = await models.User.getUuidForProfile(user)
  const ms = new Manuscript(
    config,
    userUuid,
    S3Storage,
    ScienceBeamApi,
    pubsubManager,
  )

  await ms.upload(id, file, fileSize)

  const submission = new Submission({
    models,
    services: {
      Storage: S3Storage,
    },
  })

  await submission.initialize(id, userUuid)

  return submission.toJSON()
}

module.exports = uploadManuscript
