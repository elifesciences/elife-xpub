const person = require('./elife-api.test.person')

jest.mock('config', () => ({
  server: {
    api: {
      secret: 'xpubsecret',
    },
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
  query: jest.fn(() => ({
    body: { items: [person] },
  })),
  get(url) {
    this.url = url
    return {
      header: this.header,
      query: this.query,
    }
  },
  getHeader() {
    return this.header
  },
  getQuery() {
    return this.query
  },
}))

const api = require('./elife-api')
const request = require('superagent')

describe('eLife API tests', () => {
  it('sends the Authorization token', async () => {
    await api.people()
    const header = request.getHeader()
    expect(Object.keys(header)).toContain('Authorization')
    expect(header.Authorization).toBe('xpubsecret')
  })

  it('creates the correct person structure', async () => {
    const result = await api.people()
    expect(result).toHaveLength(1)
    expect(result[0].firstname).toBe('Given Names')
    expect(result[0].surname).toBe('Surname')
    expect(result[0].email).toBe('person@email.com')
  })
})
