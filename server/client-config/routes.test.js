const express = require('express')
const supertest = require('supertest')

describe('Client config handler', () => {
  let routes;

  const makeApp = () => {
    const app = express()
    routes(app)
    return supertest(app)
  }

  beforeEach(() => {
    jest.mock('config', () => ({
      publicConfig: {
        isPublic: true,
        key: 'value'
      },
      privateConfig: {
        secret: 'password'
      },
    }))
    routes = require('./routes')
  })

  it('returns javascript', async () => {
    const request = makeApp()
    const response = await request
      .get('/config.js')
      .expect(200)
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('javascript')
    )
  })

  it('returns a response containing public config', async () => {
    const request = makeApp()
    const response = await request
      .get('/config.js')
      .expect(200)
    expect(response.text).toMatchSnapshot()
  })

})
