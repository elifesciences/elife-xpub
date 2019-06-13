const { createTables } = require('@elifesciences/component-model')
const User = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

describe('User manager', () => {
  const profileId = 'ewwboc7m'

  beforeEach(() => createTables(true))

  describe('Identifiers', () => {
    it('can find a userId given a profile Id', async () => {
      const user = await User.findOrCreate(profileId)
      const userId = await User.getUuidForProfile(profileId)
      expect(userId).toBe(user.id)
    })

    it('can find a profileId given a userId', async () => {
      const user = await User.findOrCreate(profileId)
      const foundId = await User.getProfileForUuid(user.id)
      expect(foundId).toBe(profileId)
    })
  })

  describe('findOrCreate()', () => {
    it('creates a new user if it does not exist', async () => {
      const user = await User.findOrCreate(profileId)
      expect(user.id).toBeTruthy()
    })

    it('loads existing user if found', async () => {
      const savedUser = await User.createWithIdentity(profileId)
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
        email: 'f72c502e0d657f363b5f2dc79dd8ceea',
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
      await User.createWithIdentity(profileId)

      const loadedUser = await User.findOrCreate(profileId)
      expect(loadedUser.identities).toMatchObject([
        { type: 'elife', identifier: profileId },
      ])
    })

    it('fails to update non-existent user', () =>
      expect(
        new User({
          id: 'f05bbbf9-ddf4-494f-a8da-84957e2708ee',
          defaultIdentity: 'elife',
        }).saveGraph(),
      ).rejects.toThrow())
  })
})
