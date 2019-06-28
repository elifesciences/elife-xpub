const { createTables } = require('@elifesciences/component-model')
const replaySetup = require('../../test/helpers/replay-setup')
const { Query } = require('./resolvers')

const profileId = 'ewwboc7m'

describe('User', () => {
  beforeEach(async () => {
    await createTables(true)
    replaySetup('success')
  })

  describe('currentUser', () => {
    it('returns null if no user is authenticated', async () => {
      const response = await Query.currentUser({}, {}, {})
      expect(response).toBe(null)
    })

    it('creates and returns a new user', async () => {
      const response = await Query.currentUser({}, {}, { user: profileId })
      const idents = response.identities
      expect(idents).toHaveLength(1)
      expect(idents[0].type).toBe('elife')
      expect(idents[0].identifier).toBe(profileId)
      expect(idents[0].aff).toBe('Tech team, University of eLife')
      expect(idents[0].email).toBe('f72c502e0d657f363b5f2dc79dd8ceea')
      expect(idents[0].meta.firstName).toBe('Tamlyn')
      expect(idents[0].meta.lastName).toBe('Rhodes')
    })
  })
})
