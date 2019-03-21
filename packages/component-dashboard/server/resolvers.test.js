jest.mock('@pubsweet/logger')
const { createTables } = require('@pubsweet/db-manager')
const mailer = require('@pubsweet/component-send-email')
const { User, Manuscript } = require('@elifesciences/xpub-model')
const { Mutation } = require('./resolvers')
const { userData, badUserData } = require('./resolvers.test.data')

describe('component-dashbaord resolvers', () => {
  const profileId = userData.identities[0].identifier
  let userId

  beforeEach(async () => {
    await createTables(true)
    const [user] = await Promise.all([
      new User(userData).save(),
      new User(badUserData).save(),
    ])
    userId = user.id
    mailer.clearMails()
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
  })
})
