jest.mock('superagent', () => ({
  header: {},
  url: '',
  get: jest.fn(),
  getHeader() {
    return this.header
  },
}))

const request = require('superagent')
const {
  elifeCache,
  cachedRequest,
  getKeyFromRequest,
} = require('./cached-request')

const makeGetResponse = response => () => ({
  header: request.header,
  query: response,
})

const doQuery = async query => {
  request.get.mockImplementation(makeGetResponse(query))
  const response = await cachedRequest('/endpoint', 'order=asc')
  return { response, query }
}

describe('eLife API Cache tests', () => {
  let responseContent, goodQuery, badQuery, reqWithAuth, reqNoAuth

  beforeEach(() => {
    elifeCache.clear()
    responseContent = { body: 'this is the body of the request' }
    goodQuery = jest.fn(() => Promise.resolve(responseContent))
    badQuery = jest.fn(() => Promise.reject(new Error('Bad')))
    reqWithAuth = { header: { Authorization: 'let me in' } }
    reqNoAuth = { header: { Authorization: 'keep me out' } }
  })

  it('Key generation alters given root', async () => {
    const key1 = getKeyFromRequest('root1', 'ep1', 'query1', reqWithAuth)
    const key2 = getKeyFromRequest('root2', 'ep1', 'query1', reqWithAuth)
    expect(key1).not.toEqual(key2)
    expect(key1.length).toBeGreaterThan(0)
    expect(key2.length).toBeGreaterThan(0)
  })

  it('Key generation alters given endpoint', async () => {
    const key1 = getKeyFromRequest('root1', 'ep1', 'query1', reqWithAuth)
    const key2 = getKeyFromRequest('root1', 'ep2', 'query1', reqWithAuth)
    expect(key1).not.toEqual(key2)
    expect(key1.length).toBeGreaterThan(0)
    expect(key2.length).toBeGreaterThan(0)
  })

  it('Key generation alters given query', async () => {
    const key1 = getKeyFromRequest('root1', 'ep1', 'query1', reqWithAuth)
    const key2 = getKeyFromRequest('root1', 'ep1', 'query2', reqWithAuth)
    expect(key1).not.toEqual(key2)
    expect(key1.length).toBeGreaterThan(0)
    expect(key2.length).toBeGreaterThan(0)
  })

  it('Key generation alters given request headers', async () => {
    const key1 = getKeyFromRequest('root1', 'ep1', 'query1', reqWithAuth)
    const key2 = getKeyFromRequest('root1', 'ep1', 'query1', reqNoAuth)
    expect(key1).not.toEqual(key2)
    expect(key1.length).toBeGreaterThan(0)
    expect(key2.length).toBeGreaterThan(0)
  })

  it("Cache adds entry and doesn't re-query for it", async () => {
    let response, query
    ;({ response, query } = await doQuery(goodQuery))

    expect(elifeCache.getLength()).toBe(1)
    expect(query).toHaveBeenCalledTimes(1)
    expect(response).toBe(responseContent)

    // Now repeat the query and expect the cache not to call the response
    ;({ response, query } = await doQuery(goodQuery))

    expect(elifeCache.getLength()).toBe(1)
    expect(query).toHaveBeenCalledTimes(1)
    expect(response).toBe(responseContent)
  })

  it('Cache is returned if query fails', async () => {
    let response, query
    ;({ response, query } = await doQuery(goodQuery))

    expect(elifeCache.getLength()).toBe(1)
    expect(query).toHaveBeenCalledTimes(1)
    expect(response).toBe(responseContent)

    // Now repeat the query and expect the cache not to call the response
    ;({ response, query } = await doQuery(badQuery))

    expect(elifeCache.getLength()).toBe(1)
    expect(query).toHaveBeenCalledTimes(0)
    expect(response).toBe(responseContent)
  })
})
