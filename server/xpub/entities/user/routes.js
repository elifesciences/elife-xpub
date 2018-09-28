const jwt = require('jsonwebtoken')
const config = require('config')
const logger = require('@pubsweet/logger')

const secret = config.get('pubsweet-server.secret')

module.exports = app => {
  if (config.get('login.enableMock')) {
    app.get('/mock-token-exchange/:id', async (req, res) => {
      const mockProfileId = req.params.id
      logger.info('Signing mock JWT for profile ID', mockProfileId)
      const xpubToken = await jwt.sign(
        { id: mockProfileId, iss: 'journal' },
        secret,
        { expiresIn: '1m' },
      )

      res.redirect(`/login#${xpubToken}`)
    })
  }
}
