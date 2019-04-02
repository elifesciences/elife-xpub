const config = require('config')
const { pickBy } = require('lodash')
const logger = require('@pubsweet/logger')
const jwt = require('jsonwebtoken')

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

  if (config.get('login.enableMock')) {
    app.get('/mock-token-exchange/:id', (req, res) => {
      const secret = config.get('pubsweet-server.secret')
      const mockProfileId = req.params.id
      logger.info('Signing mock JWT for profile ID', mockProfileId)
      const xpubToken = jwt.sign(
        { id: mockProfileId, iss: 'journal', 'new-session': true },
        secret,
        { expiresIn: '1m' },
      )

      res.redirect(`/login#${xpubToken}`)
    })
  }
}
