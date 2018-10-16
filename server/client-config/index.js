const config = require('config')
const { pick } = require('lodash')

const template = config => `
  window.config = ${JSON.stringify(config)}
`

const server = app => {
  app.get('/config.js', (req, res) => {
    const clientConfig = pick(config, config.publicKeys)
    const response = template(clientConfig)
    res.type('js')
    res.send(response)
  })
}

module.exports = {
  server: () => server,
}
