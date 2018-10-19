const config = require('config')
const { pickBy } = require('lodash')

const template = clientConfig => `
  window.config = ${JSON.stringify(clientConfig)}
`

module.exports = app => {
  app.get('/config.js', (req, res) => {
    const clientConfig = pickBy(config, value => value.isPublic)
    const response = template(clientConfig)
    res.type('js')
    res.send(response)
  })
}
