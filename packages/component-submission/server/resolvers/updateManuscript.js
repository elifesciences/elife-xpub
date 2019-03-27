const config = require('config')
const { User } = require('@elifesciences/component-model')
const Manuscript = require('@elifesciences/component-model-manuscript')

async function updateManuscript(_, { data }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const ms = new Manuscript(config, userUuid)
  return ms.update(data)
}

module.exports = updateManuscript
