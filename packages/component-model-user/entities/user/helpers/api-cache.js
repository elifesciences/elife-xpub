const crypto = require('crypto')

class ApiCache {
  constructor(ttl) {
    this.ttl = ttl
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
      result = elapsed > this.ttl
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

module.exports = ApiCache
