const config = require('config')
const { Manuscript } = require('@elifesciences/xpub-controller')

async function updateManuscript(_, { data }, { user }) {
  const ms = new Manuscript(config, user)
  return ms.update(data)
}

module.exports = updateManuscript
