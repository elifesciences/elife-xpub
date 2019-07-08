jest.mock('config', () => ({
  server: {
    api: {
      secret: 'xpubsecret',
    },
  },
  has(key) {
    return true
  },
  get(key) {
    if (key === 'server.api.secret') {
      return this.server.api.secret
    }
    return key
  },
}))

jest.mock('superagent', () => ({
  header: {},
  url: '',
  get: jest.fn(),
  getHeader() {
    return this.header
  },
}))

const makeGetResponse = examplePerson => () => ({
  header: request.header,
  query: jest.fn(() =>
    Promise.resolve({
      body: { items: [examplePerson] },
    }),
  ),
})

const logger = require('@pubsweet/logger')
const request = require('superagent')
const api = require('./elife-api')
const person = require('./elife-api.test.person')

describe('eLife API tests', () => {
  it('sends the Authorization token', async () => {
    request.get.mockImplementationOnce(makeGetResponse(person.allDetails))
    await api.people()
    const header = request.getHeader()
    expect(Object.keys(header)).toContain('Authorization')
    expect(header.Authorization).toBe('xpubsecret')
  })

  it('creates the correct person structure', async () => {
    request.get.mockImplementationOnce(makeGetResponse(person.allDetails))
    const result = await api.people()
    expect(result).toHaveLength(1)
    expect(result[0].firstname).toBe(person.allDetails.name.givenNames)
    expect(result[0].surname).toBe(person.allDetails.name.surname)
    expect(result[0].email).toBe(person.allDetails.emailAddresses[0].value)
    expect(result[0].aff).toBe(person.allDetails.affiliations[0].name[0])
    expect(result[0].expertises).toHaveLength(
      person.allDetails.research.expertises.length,
    )
    expect(result[0].focuses).toHaveLength(
      person.allDetails.research.focuses.length,
    )
  })

  it('creates correct person with minimum required data', async () => {
    request.get.mockImplementationOnce(makeGetResponse(person.minimumDetails))
    const result = await api.people()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(person.minimumDetails.id)
  })

  it('query string formatted for PHP', async () => {
    let queryString = ''
    const storedImplementation = request.get
    request.get.mockImplementation(() => ({
      header: request.header,
      query: jest.fn(query => {
        queryString = query
        return Promise.resolve({ body: { items: [] } })
      }),
    }))
    await api.people('senior-editor')
    expect(queryString).toBe(
      'order=asc&page=1&per-page=100&type[]=senior-editor',
    )

    await api.people('senior-editor,leadership')
    expect(queryString).toBe(
      'order=asc&page=1&per-page=100&type[]=senior-editor&type[]=leadership',
    )
    request.get = storedImplementation
  })

  it('logs on error', async () => {
    request.get.mockImplementationOnce(() => ({
      header: request.header,
      query: jest.fn(() => Promise.reject(new Error('Forbidden'))),
    }))
    jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
    await expect(api.people()).rejects.toThrow('Forbidden')
    expect(logger.error).toHaveBeenCalled()
  })

  it('throws a TypeError on invalid role', async () => {
    await expect(api.people('dogs,cats')).rejects.toThrow(
      'Invalid Role Querying the eLife API: dogs',
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
