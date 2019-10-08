const superagent = require('superagent')
const config = require('config')
const logger = require('@pubsweet/logger')

const apiRoot = config.get('server.api.url')

const request = (endpoint, query = {}) => {
  const req = superagent.get(apiRoot + endpoint)

  // only had the header if its defined in config
  const secret = config.get('server.api.secret')
  if (secret) {
    req.header.Authorization = secret
  }
  return req.query(query).catch(err => {
    logger.error('Failed to fetch from eLife API:', err.message, err.stack)
    throw err
  })
}
module.exports = request
