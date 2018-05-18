const http = require('http')
const express = require('express')

const app = express()
const querystring = require('querystring')
const logger = require('@pubsweet/logger')
const morgan = require('morgan')
const Promise = require('bluebird')
const config = require('config')

const startServer = async () => {
  const { port } = config.get('orcid-server')
  app.set('port', port)

  app.use(morgan('combined', { stream: logger.stream }))

  app.get('/oauth/authorize', (req, res) => {
    const redirectUri = req.query.redirect_uri
    const state = req.query.state || 'test_state'
    const code = `code_${state}`
    const query = querystring.stringify({ code, state })
    const location = `${redirectUri}?${query}`
    res.redirect(302, location)
  })

  app.post('/oauth/token', (req, res) => {
    const { code } = req.query
    res.json({
      access_token: 'f7617529-f46a-40b1-99f4-4181859783ca',
      token_type: 'bearer',
      refresh_token: `refresh_token_${code}`,
      expires_in: 30 * 24 * 60 * 60,
      scope: '/authenticate',
      orcid: '0000-0003-3146-0256',
      name: 'Josiah Carberry',
    })
  })

  const server = http.createServer(app)
  logger.info(`Starting mock orcid server`)
  const startListening = Promise.promisify(server.listen, { context: server })
  await startListening(port)
  logger.info(`Orcid server is listening on port ${port}`)
  return server
}

module.exports = startServer
