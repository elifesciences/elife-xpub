const jwt = require('jsonwebtoken')
const config = require('config')
const logger = require('@pubsweet/logger')
const { promisify } = require('util')
const UserManager = require('.')

const verifyToken = promisify(jwt.verify)
const signToken = promisify(jwt.sign)
const secret = config.get('pubsweet-server.secret')

module.exports = app => {
  app.get('/token-exchange', async (req, res) => {
    const journalToken = req.get('x-elife-token') || req.query.token

    let payload
    try {
      payload = await verifyToken(journalToken, secret)
    } catch (err) {
      logger.warn('Failed to validate Journal token', err)
      // TODO nicer error page
      res.sendStatus(403)
      return
    }

    const user = UserManager.findOrCreate(payload.id)

    const xpubToken = await signToken({ id: user.id }, secret, {
      expiresIn: '1d',
    })

    res.redirect(`/#${xpubToken}`)
  })
}
