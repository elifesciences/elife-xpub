const path = require('path')
const Replay = require('replay')

// Replay records outbound HTTP requests
//
// By default it replays existing ones and blocks new requests.
// When writing or updating tests you'll want to change the mode
// see https://github.com/assaf/node-replay#settings

module.exports = subFolder => {
  Replay.fixtures = path.join(__dirname, '..', 'http-mocks', subFolder)
  Replay.headers = [/^accept/, /^body/, /^content-type/, /^host/, /^if-/, /^x-/]
  Replay.passThrough('app')
}
