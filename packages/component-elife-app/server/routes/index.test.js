jest.mock('config')
const config = require('config')

const realConfig = jest.requireActual('config')

jest.mock('@pubsweet/logger')
const { goodSymbol, badSymbol, disabledSymbol } = require('../statusPage')
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
  it('returns 500 when app not ok', async () => {
    const request = makeApp()
    const result = await request.get('/status')
    expect(result.res.text).toContain(`${goodSymbol} General`)
    expect(result.res.text).toContain(`${goodSymbol} S3`)
    expect(result.res.text).toContain(`${goodSymbol} Database`)
    expect(result.res.text).toContain(`${badSymbol} SFTP`)
    expect(result.status).toBe(500)
  })

  it('returns 200 when app not ok', async () => {
    config.get.mockImplementation(key => {
      if (key === 'meca.sftp.disableUpload') return true
      return realConfig.get(key)
    })
    const request = makeApp()
    const result = await request.get('/status')
    expect(result.res.text).toContain(`${goodSymbol} General`)
    expect(result.res.text).toContain(`${goodSymbol} S3`)
    expect(result.res.text).toContain(`${goodSymbol} Database`)
    expect(result.res.text).toContain(`${disabledSymbol} SFTP`)
    expect(result.status).toBe(200)
  })
})
