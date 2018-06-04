const express = require('express')
const supertest = require('supertest')
const nock = require('nock')
const { createTables } = require('@pubsweet/db-manager')
const auth = require('./orcid')

const makeApp = () => {
  const app = express()
  auth(app)
  return supertest(app)
}

/* Example JWT
 * {
 *   "username": "0000000331460256",
 *   "id": "7a9da753-93f7-4245-bc85-10058d578e40",
 *   "iat": 1523965654,
 *   "exp": 1524052054
 * }
 */

describe('ORCID auth', () => {
  beforeEach(() => createTables(true))

  it('exchanges code and returns JWT', async () => {
    // mock OAuth response
    nock('http://localhost:8080')
      .post('/oauth/token')
      .reply(200, {
        access_token: 'token456',
        token_type: 'bearer',
        refresh_token: 'token123',
        expires_in: 631138518,
        scope: '/read-limited',
        name: 'Test User',
        orcid: '0000-0003-3146-0256',
      })

    const app = makeApp()
    const response = await app.get('/auth/orcid/callback?code=def')
    expect(response.header.location).toMatch(/^\/login#\w+/)
  })
})
