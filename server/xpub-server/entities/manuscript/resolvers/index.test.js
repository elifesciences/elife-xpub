jest.mock('@pubsweet/logger')

const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const mailer = require('@pubsweet/component-send-email')
const { User, Manuscript } = require('@elifesciences/xpub-model')
const { Mutation, Query } = require('.')
const { userData, badUserData } = require('./index.test.data')

const replaySetup = require('../../../../../test/helpers/replay-setup')

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await Promise.all([
      fs.remove(config.get('pubsweet-server.uploads')),
      createTables(true),
    ])
    const [user] = await Promise.all([
      new User(userData).save(),
      new User(badUserData).save(),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('manuscript', () => {
    it('Gets form data', async () => {
      const manuscriptData = {
        createdBy: userId,
        meta: { title: 'title' },
        status: 'INITIAL',
      }
      const { id } = await new Manuscript(manuscriptData).save()

      const manuscript = await Query.manuscript({}, { id }, { user: profileId })
      expect(manuscript).toMatchObject(manuscriptData)
    })
  })

  describe('createManuscript', () => {
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

  describe('deleteManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = new Manuscript({ createdBy: userId })
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
      const blankManuscript = new Manuscript({ createdBy: userId })
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
})
