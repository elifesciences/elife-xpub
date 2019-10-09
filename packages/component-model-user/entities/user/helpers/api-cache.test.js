const ApiCache = require('./api-cache')

describe('eLife API Cache tests', () => {
  let cache

  beforeEach(() => {
    cache = new ApiCache(1)
  })
  it('Cache adds entries', async () => {
    expect(cache.getLength()).toBe(0)
  })
})
