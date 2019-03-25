jest.mock('@pubsweet/logger')

const { createTables } = require('@pubsweet/db-manager')
const { User, Manuscript } = require('@elifesciences/component-model')
const { Mutation } = require('.')
const {
  userData,
  badUserData,
  expectedManuscript,
  manuscriptInput,
} = require('./index.test.data')

const replaySetup = require('../../../../../test/helpers/replay-setup')

describe('Manuscript resolvers', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await createTables(true)
    const [user] = await Promise.all([
      new User(userData).save(),
      new User(badUserData).save(),
    ])
    userId = user.id
  })

  describe('updateManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const manuscript = await new Manuscript({ createdBy: userId }).save()
      await expect(
        Mutation.updateManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('fails if manuscript has already been submitted', async () => {
      const manuscript = await new Manuscript({
        createdBy: userId,
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      }).save()
      await expect(
        Mutation.updateManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: profileId },
        ),
      ).rejects.toThrow(
        'Cannot update manuscript with status of MECA_EXPORT_PENDING',
      )
    })

    it('updates the current submission for user with data', async () => {
      const manuscript = await new Manuscript({ createdBy: userId }).save()

      await Mutation.updateManuscript(
        {},
        { data: { id: manuscript.id, ...manuscriptInput } },
        { user: profileId },
      )
      const actualManuscript = await Manuscript.find(manuscript.id, userId)
      expect(actualManuscript).toMatchObject(expectedManuscript)
    })
  })
})
