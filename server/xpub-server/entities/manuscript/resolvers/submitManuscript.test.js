jest.mock('@pubsweet/logger')
jest.mock('@elifesciences/xpub-meca-export', () => ({
  mecaExport: jest.fn(() => Promise.resolve()),
}))

const lodash = require('lodash')
const logger = require('@pubsweet/logger')
const { createTables } = require('@pubsweet/db-manager')
const mailer = require('@pubsweet/component-send-email')
const { mecaExport } = require('@elifesciences/xpub-meca-export')
const {
  UserManager: User,
  FileManager,
  ManuscriptManager: Manuscript,
} = require('@elifesciences/xpub-model')
const { Mutation } = require('.')
const {
  userData,
  badUserData,
  expectedManuscript,
  manuscriptInput,
} = require('./index.test.data')

const replaySetup = require('../../../../../test/helpers/replay-setup')

async function waitforEmails(NUM_EMAILS) {
  for (let i = 0; i < 100 && mailer.getMails().length < NUM_EMAILS; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 10))
  }
}

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await createTables(true)
    const [user] = await Promise.all([
      User.save(userData),
      User.save(badUserData),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('submitManuscript', () => {
    let id, initialManuscript

    beforeAll(() =>
      jest
        .spyOn(FileManager, 'getContent')
        .mockImplementation(() => 'A real PDF'))

    afterAll(() => FileManager.getContent.mockRestore())

    beforeEach(async () => {
      jest.clearAllMocks()

      initialManuscript = Manuscript.new({ createdBy: userId })
      initialManuscript.files = [
        {
          url: 'fake-path.pdf',
          filename: 'FakeManuscript.pdf',
          type: 'MANUSCRIPT_SOURCE',
        },
      ]

      const manuscript = await Manuscript.save(initialManuscript)
      id = manuscript.id
    })

    it('stores data with new status', async () => {
      const returnedManuscript = await Mutation.submitManuscript(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId },
      )

      expect(returnedManuscript.status).toBe(
        Manuscript.statuses.MECA_EXPORT_PENDING,
      )

      const storedManuscript = await Manuscript.find(id, userId)

      expect(storedManuscript).toMatchObject({
        ...expectedManuscript,
        status: expect.stringMatching(/^MECA_EXPORT_(SUCCEEDED|PENDING)/),
      })
    })

    it('calls meca export with correct arguments', async () => {
      const ip = '1.2.3.4'
      await Mutation.submitManuscript(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId, ip },
      )

      expect(mecaExport).toHaveBeenCalled()
      const [
        actualManuscript,
        actualContent,
        actualIp,
      ] = mecaExport.mock.calls[0]
      expect(actualManuscript.id).toBe(id)
      expect(actualContent).toBe('A real PDF')
      expect(actualIp).toBe(ip)
    })

    it('removes blank optional reviewer rows', async () => {
      const manuscript = lodash.cloneDeep(manuscriptInput)
      manuscript.id = id
      manuscript.suggestedReviewers = [
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: '', email: '' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
        { name: '', email: '' },
      ]
      await Mutation.submitManuscript(
        {},
        { data: manuscript },
        { user: profileId },
      )

      const storedManuscript = await Manuscript.find(id, userId)
      const team = storedManuscript.teams.find(
        t => t.role === 'suggestedReviewer',
      )
      expect(team.teamMembers.map(member => member.meta)).toEqual([
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
      ])
    })

    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new({ createdBy: userId })
      const manuscript = await Manuscript.save(blankManuscript)
      await expect(
        Mutation.submitManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('fails if manuscript has already been submitted', async () => {
      const blankManuscript = Manuscript.new({
        createdBy: userId,
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      })
      const manuscript = await Manuscript.save(blankManuscript)
      await expect(
        Mutation.submitManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: profileId },
        ),
      ).rejects.toThrow(
        'Cannot submit manuscript with status of MECA_EXPORT_PENDING',
      )
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      await expect(
        Mutation.submitManuscript(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow()
    })

    it('fails when manuscript has bad data types', async () => {
      const badManuscript = lodash.cloneDeep(manuscriptInput)
      lodash.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      await expect(
        Mutation.submitManuscript(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow(
        '"title" is not allowed. "manuscriptType" is not allowed',
      )
    })

    it('sends email and updates status when export fails', async () => {
      const NUM_EMAILS = 1
      jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
      mecaExport.mockImplementationOnce(() =>
        Promise.reject(new Error('Broked')),
      )

      const manuscript = lodash.cloneDeep(manuscriptInput)
      manuscript.id = id
      await Mutation.submitManuscript(
        {},
        { data: manuscript },
        { user: profileId },
      )

      await waitforEmails(NUM_EMAILS)

      const allEmails = mailer.getMails()
      expect(allEmails).toHaveLength(NUM_EMAILS)

      // Check the MECA fail email
      expect(allEmails[0]).toMatchObject({
        to: 'test@example.com',
        subject: 'MECA export failed',
      })
      expect(logger.error).toHaveBeenCalled()
      const updatedManuscript = await Manuscript.find(manuscript.id, userId)
      expect(updatedManuscript.status).toBe(
        Manuscript.statuses.MECA_EXPORT_FAILED,
      )
    })
  })
})
