jest.mock('superagent', () => ({
  header: {},
  url: '',
  get: jest.fn(),
  getHeader() {
    return this.header
  },
}))

const makeGetResponse = response => () => ({
  header: request.header,
  query: response,
})

const request = require('superagent')
const { elifeCache, cachedRequest } = require('./cached-request')

const doQuery = async query => {
  request.get.mockImplementation(makeGetResponse(query))
  const response = await cachedRequest('/endpoint', 'order=asc')
  return { response, query }
}

describe('eLife API Cache tests', () => {
  let responseContent, goodQuery, badQuery

  beforeEach(() => {
    elifeCache.clear()
    responseContent = { body: 'this is the body of the request' }
    goodQuery = jest.fn(() => Promise.resolve(responseContent))
    badQuery = jest.fn(() => Promise.reject(new Error('Bad')))
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
