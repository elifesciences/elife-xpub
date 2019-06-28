jest.mock('@pubsweet/logger')
const { createTables } = require('@elifesciences/component-model')
const mailer = require('@pubsweet/component-send-email')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { Mutation } = require('./resolvers')
const { userData, badUserData } = require('./resolvers.test.data')

describe('component-dashboard resolvers', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    await createTables(true)
    const [user] = await Promise.all([
      User.createWithIdentity(profileId),
      User.createWithIdentity(badProfileId),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('Mutations:deleteManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.makeInitial({ createdBy: userId })
      const manuscript = await blankManuscript.save()

      await expect(
        Mutation.deleteManuscript(
          {},
          { id: manuscript.id },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('removes manuscript from database', async () => {
      const blankManuscript = Manuscript.makeInitial({ createdBy: userId })
      const manuscript = await blankManuscript.save()
      await Mutation.deleteManuscript(
        {},
        { id: manuscript.id },
        { user: profileId },
      )

      const manuscripts = await Manuscript.all(userId)
      expect(manuscripts).toEqual([])
    })
  })

  describe('Mutations:createManuscript', () => {
    it('fails if no authenticated user', async () => {
      await expect(Mutation.createManuscript({}, {}, {})).rejects.toThrow(
        'Not logged in',
      )
    })

    it('adds new manuscript to the db for current user with status INITIAL', async () => {
      const manuscript = await Mutation.createManuscript(
        {},
        {},
        { user: profileId },
      )

      const manuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].id).toBe(manuscript.id)
    })

    it('adds new manuscript to the db for current user with correct lastStepVisited', async () => {
      await Mutation.createManuscript({}, {}, { user: profileId })

      const manuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].lastStepVisited).toBe(
        `/submit/${manuscripts[0].id}/author`,
      )
    })
  })
})
