const superagent = require('superagent')
const logger = require('@pubsweet/logger')
const config = require('config')
const ApiCache = require('./api-cache')

const apiRoot = config.get('server.api.url')
const elifeCache = new ApiCache(600)

const cachedRequest = async (endpoint, query = {}) => {
  const uri = apiRoot + endpoint
  const req = superagent.get(uri)

  // only had the header if its defined in config
  const secret = config.get('server.api.secret')
  if (secret) {
    req.header.Authorization = secret
  }
  const hash = ApiCache.makeHash(uri + query, req)
  const found = elifeCache.hasEntry(hash)
  const expired = elifeCache.isExpired(hash)

  let result = null
  try {
    if (found && !expired) {
      result = elifeCache.getResult(hash)
    } else {
      // if we are here then the cache is expired or stale
      result = await req.query(query)
      elifeCache.addEntry(hash, result)
    }
  } catch (err) {
    logger.error('Failed to fetch from eLife API:', err.message, err.stack)
    if (found) {
      // error doing query - last resort return stale data
      result = elifeCache.getResult(hash)
    } else {
      // error doing query and nothing in cache - so error
      throw err
    }
  }
  return result
}

module.exports = {
  cachedRequest,
  elifeCache,
}
