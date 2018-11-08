const { createTables } = require('@pubsweet/db-manager')
const User = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

describe('User manager', () => {
  const profileId = 'ewwboc7m'

  beforeEach(() => createTables(true))

  describe('findOrCreate()', () => {
    it('creates a new user if it does not exist', async () => {
      const user = await User.findOrCreate(profileId)
      expect(user.id).toBeTruthy()
    })

    it('loads existing user if found', async () => {
      const savedUser = await new User({
        identities: [{ type: 'elife', identifier: profileId }],
      }).save()
      const loadedUser = await User.findOrCreate(profileId)

      expect(loadedUser).toMatchObject({
        id: savedUser.id,
        identities: [{ type: 'elife', userId: savedUser.id }],
      })
    })

    it('extends user identity with API data', async () => {
      const actualUser = await User.findOrCreate(profileId)
      const identity = actualUser.identities[0]
      expect(identity).toMatchObject({
        name: 'Tamlyn Rhodes',
        email: 'example@example.org',
        aff: 'Tech team, University of eLife',
        meta: {
          firstName: 'Tamlyn',
          lastName: 'Rhodes',
          orcid: '0000-0002-6277-0372',
        },
      })
    })
  })

  describe('save()', () => {
    it('saves identities with user', async () => {
      const identities = [{ type: 'elife', identifier: profileId }]
      await new User({ identities }).save()
      const loadedUser = await User.findOrCreate(profileId)
      expect(loadedUser.identities).toMatchObject(identities)
    })

    it('fails to update non-existent user', () =>
      expect(
        new User({
          id: 'f05bbbf9-ddf4-494f-a8da-84957e2708ee',
          defaultIdentity: 'elife',
        }).save(),
      ).rejects.toThrow())
  })
})
