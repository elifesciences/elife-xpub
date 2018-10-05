const { createTables } = require('@pubsweet/db-manager')
const UserManager = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

describe('User manager', () => {
  const profileId = 'ewwboc7m'

  beforeEach(() => createTables(true))

  describe('findOrCreate()', () => {
    it('creates a new user if it does not exist', async () => {
      const user = await UserManager.findOrCreate(profileId)
      expect(user.id).toBeTruthy()
    })

    it('loads existing user if found', async () => {
      const expectedUser = await UserManager.save({
        identities: [{ type: 'elife', identifier: profileId }],
      })

      const actualUser = await UserManager.findOrCreate(profileId)

      expect(actualUser).toMatchObject(expectedUser)
    })

    it('extends user identity with API data', async () => {
      const actualUser = await UserManager.findOrCreate(profileId)
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
    it('fails to update non-existent user', () =>
      expect(
        UserManager.save({
          id: 'f05bbbf9-ddf4-494f-a8da-84957e2708ee',
          defaultIdentity: 'foo',
        }),
      ).rejects.toThrow('User not found'))
  })
})
