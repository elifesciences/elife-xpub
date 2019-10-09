const ApiCache = require('./api-cache')

describe('API Cache tests', () => {
  let cache, key, key2, ttl

  beforeEach(() => {
    ttl = 600
    cache = new ApiCache(ttl)
    key = 'front door'
    key2 = 'back door'
  })

  it('Cache produces different hashes', async () => {
    const hash1 = cache.addEntry(key, { a: 1 })
    const hash2 = cache.addEntry(key2, { a: 1 })
    expect(hash1).not.toEqual(hash2)
    expect(hash1).toHaveLength(32)
    expect(hash2).toHaveLength(32)
  })

  it('Cache returns null if entry does not exist', async () => {
    expect(cache.getLength()).toBe(0)
    expect(cache.getResult(key)).toBeNull()
  })

  it('Cache adds entries', async () => {
    expect(cache.getLength()).toBe(0)
    cache.addEntry(key, { a: 1 })
    expect(cache.getLength()).toBe(1)
  })

  it('Cache can be cleared', async () => {
    expect(cache.getLength()).toBe(0)
    cache.addEntry(key, { a: 1 })
    cache.addEntry(key2, { a: 2 })
    expect(cache.getLength()).toBe(2)
    cache.clear()
    expect(cache.getLength()).toBe(0)
  })

  it('Cache updates entries', async () => {
    expect(cache.getLength()).toBe(0)
    cache.addEntry(key, { a: 1 })
    expect(cache.getLength()).toBe(1)
    cache.addEntry(key, { a: 2 })
    expect(cache.getLength()).toBe(1)
    expect(cache.getResult(key)).toEqual({ a: 2 })
  })

  it('Cache respects ttl', async () => {
    const originalDate = Date

    cache.addEntry(key, { a: 1 })
    const now = Date.now()
    expect(cache.getLength()).toBe(1)
    expect(cache.hasEntry(key)).toBe(true)
    expect(cache.hasLiveEntry(key)).toBe(true)

    // sometime later but not exceeding TTL
    global.Date.now = jest.fn(() => now + ttl / 2)
    expect(cache.hasEntry(key)).toBe(true)
    expect(cache.hasLiveEntry(key)).toBe(true)

    // Exceeded TTL
    global.Date.now = jest.fn(() => now + ttl + 1)
    expect(cache.hasEntry(key)).toBe(true)
    expect(cache.hasLiveEntry(key)).toBe(false)
    expect(cache.getResult(key)).toEqual({ a: 1 })

    // restore global Date object
    global.Date = originalDate
  })
})
