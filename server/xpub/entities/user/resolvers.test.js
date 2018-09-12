const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const { Query } = require('./resolvers')

const replaySetup = require('../../../../test/helpers/replay-setup')

describe('User', () => {
  beforeEach(async () => {
    await createTables(true)
    replaySetup('success')
  })

  describe('orcidDetails', () => {
    it('fails if user not found', async () => {
      await expect(
        Query.orcidDetails({}, {}, { user: uuid.v4() }),
      ).rejects.toThrow('User not found')
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
