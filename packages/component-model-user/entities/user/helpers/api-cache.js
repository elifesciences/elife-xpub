const crypto = require('crypto')

//
// Simple implementation of a cache
//

class ApiCache {
  constructor(ttl) {
    this.ttl = ttl
    this.clear()
  }

  clear() {
    this._cache = {}
  }

  addEntry(key, result) {
    const hash = this._keyToHash(key)

    this._cache[hash] = {
      result,
      time: Date.now(),
    }
  }

  _isExpired(hash) {
    let result = true
    if (hash in this._cache) {
      const elapsed = Date.now() - this._cache[hash].time
      result = elapsed > this.ttl
    }
    return result
  }

  hasEntry(key) {
    const hash = this._keyToHash(key)
    return hash in this._cache
  }

  hasLiveEntry(key) {
    const hash = this._keyToHash(key)
    if (hash in this._cache && this._isExpired(hash)) {
      return false
    }
    return hash in this._cache
  }

  getResult(key) {
    let result = null
    const hash = this._keyToHash(key)

    if (hash in this._cache) {
      result = this._cache[hash].result
    }

    return result
  }

  // eslint-disable-next-line class-methods-use-this
  _keyToHash(key) {
    return ApiCache.md5(key)
  }

  static md5(s) {
    return crypto
      .createHash('md5')
      .update(s)
      .digest('hex')
  }

  getLength() {
    return Object.keys(this._cache).length
  }
}

module.exports = ApiCache
