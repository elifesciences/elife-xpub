jest.mock('@pubsweet/logger')
const { goodSymbol, badSymbol } = require('../statusPage')
const express = require('express')
const supertest = require('supertest')
const routes = require('.')

const makeApp = () => {
  const app = express()
  routes(app)
  return supertest(app)
}

describe('ping route test', () => {
  it('returns success when app ok', async () => {
    const request = makeApp()
    await request.get('/ping').expect(200)
  })
})

describe('status route test', () => {
  it('returns success when app ok', async () => {
    const request = makeApp()
    const result = await request.get('/status')
    expect(result.res.text).toContain(`${goodSymbol} General`)
    expect(result.res.text).toContain(`${goodSymbol} S3`)
    expect(result.res.text).toContain(`${goodSymbol} Database`)
    expect(result.res.text).toContain(`${badSymbol} SFTP`)
  })
})
