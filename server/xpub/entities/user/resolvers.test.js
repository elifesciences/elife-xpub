const { createTables } = require('@pubsweet/db-manager')
const { Query } = require('./resolvers')
const UserManager = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

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
      expect(response).toMatchObject({
        identities: [{ type: 'elife', identifier: profileId }],
      })
    })
  })

  describe('orcidDetails', () => {
    it('fails if user not found', async () => {
      await expect(
        Query.orcidDetails({}, {}, { user: 'badprofileid' }),
      ).rejects.toThrow('User not found')
    })

    it('returns user details', async () => {
      await UserManager.findOrCreate(profileId)
      const response = await Query.orcidDetails({}, {}, { user: profileId })
      expect(response).toEqual({
        aff: 'Tech team, University of eLife',
        email: 'example@example.org',
        firstName: 'Tamlyn',
        lastName: 'Rhodes',
      })
    })
  })

  describe('editors', () => {
    it('returns a list of senior editors', async () => {
      const result = await Query.editors({}, { role: 'senior-editor' })
      expect(result).toHaveLength(40)
      expect(result[0]).toEqual({
        id: '8d7e57b3',
        aff: undefined,
        name: 'Richard Aldrich',
        subjectAreas: [
          'Structural Biology and Molecular Biophysics',
          'Neuroscience',
        ],
      })
    })
  })
})
