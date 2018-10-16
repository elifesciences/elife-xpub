const config = require('config')
const { pick } = require('lodash')

const template = clientConfig => `
  window.config = ${JSON.stringify(clientConfig)}
`

module.exports = app => {
  app.get('/config.js', (req, res) => {
    const clientConfig = pick(config, config.publicKeys)
    const response = template(clientConfig)
    res.type('js')
    res.send(response)
  })
}
