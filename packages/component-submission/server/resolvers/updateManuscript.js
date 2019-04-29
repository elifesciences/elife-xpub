const config = require('config')
const User = require('@elifesciences/component-model-user').model
const { S3Storage } = require('@elifesciences/component-service-s3')
const { Manuscript } = require('../use-cases')

async function updateManuscript(_, { data }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const ms = new Manuscript(config, userUuid, S3Storage)
  return ms.update(data)
}

module.exports = updateManuscript
