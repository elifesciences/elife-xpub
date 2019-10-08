const superagent = require('superagent')
const logger = require('@pubsweet/logger')
const config = require('config')
const crypto = require('crypto')

const apiRoot = config.get('server.api.url')

class ApiCache {
  constructor(maxSeconds) {
    this.maxSeconds = maxSeconds
    this.clear()
  }

  clear() {
    this._cache = {}
  }

  static md5(s) {
    return crypto
      .createHash('md5')
      .update(s)
      .digest('hex')
  }

  addEntry(hash, result) {
    this._cache[hash] = {
      result,
      time: Date.now(),
    }
  }

  static makeHash(uri, req) {
    const rString = uri + JSON.stringify(req)
    const result = ApiCache.md5(rString)
    return result
  }

  isExpired(hash) {
    let result = true
    if (this.hasEntry(hash)) {
      const elapsed = this._cache[hash].time - Date.now()
      result = elapsed > this.maxSeconds
    }
    return result
  }

  hasEntry(hash) {
    return hash in this._cache
  }

  getResult(hash) {
    let result = null

    if (this.hasEntry(hash)) {
      result = this._cache[hash].result
    }

    return result
  }

  getLength() {
    return Object.keys(this._cache).length
  }
}

const elifeCache = new ApiCache()

const request = async (endpoint, query = {}) => {
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
    // last resort return stale data
    if (found) {
      result = elifeCache.getResult(hash)
    } else {
      throw err
    }
  }
  return result
}

module.exports = {
  request,
  elifeCache,
}
