const { Query } = require('./resolvers')

const replaySetup = require('../../../../test/helpers/replay-setup')

describe('User', () => {
  beforeEach(() => replaySetup('success'))

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
