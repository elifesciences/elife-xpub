const superagent = require('superagent')
const logger = require('@pubsweet/logger')
const config = require('config')
const ApiCache = require('./api-cache')

const apiRoot = config.get('server.api.url')
const elifeCache = new ApiCache(600)

const getKeyFromRequest = (root, endpoint, query, req) => root + endpoint + query + JSON.stringify(req)
//
// cachedRequest() is meant to be a drop in replacement for superagent.request
//
const cachedRequest = async (endpoint, query = {}) => {
  const req = superagent.get(apiRoot + endpoint)

  // only had the header if its defined in config
  const secret = config.get('server.api.secret')
  if (secret) {
    req.header.Authorization = secret
  }

  const key = getKeyFromRequest(apiRoot, endpoint, query, req)
  const found = elifeCache.hasLiveEntry(key)

  let result = null
  try {
    if (found) {
      result = elifeCache.getResult(key)
    } else {
      // if we are here then the cache is expired or stale
      result = await req.query(query)
      elifeCache.addEntry(key, result)
    }
  } catch (err) {
    logger.error('Failed to fetch from eLife API:', err.message, err.stack)
    if (elifeCache.hasEntry(key)) {
      // error doing query - last resort return stale data
      result = elifeCache.getResult(key)
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
  getKeyFromRequest,
}
