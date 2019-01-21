const { createTables } = require('@pubsweet/db-manager')
const config = require('config')
const logger = require('@pubsweet/logger')
const express = require('express')
const bodyParser = require('body-parser')
const supertest = require('supertest')
const { Manuscript, User } = require('@elifesciences/xpub-model')
const routes = require('./routes')

const makeApp = () => {
  const app = express()
  app.use(bodyParser.json())
  routes(app)
  return supertest(app)
}

describe.only('MECA HTTP callback handler', () => {
  let userId
  const apiKey = config.get('meca.apiKey')

  beforeEach(async () => {
    jest.clearAllMocks()
    await createTables(true)
    const profileId = 'ewwboc7m'
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
    userId = user.id
  })

  it('rejects wrong API key', async () => {
    jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/f05bbbf9-ddf4-494f-a8da-84957e2708ee`)
      .set('Authorization', `Bearer wrong-token`)
      .send({ result: 'success' })
      .expect(403, { error: 'Invalid API key' })
    expect(logger.warn).toHaveBeenCalled()
  })

  it('rejects wrong request body', async () => {
    jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/f05bbbf9-ddf4-494f-a8da-84957e2708ee`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'foobar' })
      .expect(400, { error: 'Invalid request body' })
    expect(logger.warn).toHaveBeenCalled()
  })

  it('updates manuscript status on success', async () => {
    const manuscript = await new Manuscript({ createdBy: userId }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'success' })
      .expect(204)
    const updatedManuscript = await Manuscript.find(manuscript.id, userId)
    expect(updatedManuscript.status).toBe(
      Manuscript.statuses.MECA_IMPORT_SUCCEEDED,
    )
  })

  it('updates manuscript status on failure', async () => {
    const manuscript = await new Manuscript({ createdBy: userId }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'failure' })
      .expect(204)
    const updatedManuscript = await Manuscript.find(manuscript.id, userId)
    expect(updatedManuscript.status).toBe(
      Manuscript.statuses.MECA_IMPORT_FAILED,
    )
  })

  it('fails for invalid manuscript ID', async () => {
    jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/F05BBBF9-DDF4-494F-A8DA-84957E2708EE`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'success' })
      .expect(500, { error: 'Manuscript not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})
