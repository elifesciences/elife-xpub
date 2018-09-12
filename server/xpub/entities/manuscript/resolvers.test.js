jest.mock('@elifesciences/xpub-meca-export', () =>
  jest.fn(() => Promise.resolve()),
)

const lodash = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const logger = require('@pubsweet/logger')
const { createTables } = require('@pubsweet/db-manager')
const mailer = require('@pubsweet/component-send-email')
const mecaExport = require('@elifesciences/xpub-meca-export')
const User = require('../user')
const { Mutation, Query } = require('./resolvers')
const emptyManuscript = require('./helpers/empty')
const Manuscript = require('.')

const replaySetup = require('../../../../test/helpers/replay-setup')

const userData = {
  username: 'testuser',
  email: 'test@example.com',
  orcid: '0000-0003-3146-0256',
  oauth: { accessToken: 'f7617529-f46a-40b1-99f4-4181859783ca' },
}
const badUserData = {
  username: 'baduser',
  email: 'bad@example.com',
  orcid: '0000-0001-0000-0000',
  oauth: { accessToken: 'badbadbad-f46a-40b1-99f4-4181859783ca' },
}

describe('Submission', () => {
  let userId
  let badUserId

  beforeEach(async () => {
    replaySetup('success')
    await Promise.all([
      fs.remove(config.get('pubsweet-server.uploads')),
      createTables(true),
    ])
    const [user, badUser] = await Promise.all([
      User.save(userData),
      User.save(badUserData),
    ])
    userId = user.id
    badUserId = badUser.id
    mailer.clearMails()
  })

  describe('currentSubmission', () => {
    it('Gets form data', async () => {
      const expectedManuscript = {
        createdBy: userId,
        meta: {
          title: 'title',
        },
        status: 'INITIAL',
      }
      await Manuscript.save(expectedManuscript)

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toMatchObject(expectedManuscript)
    })

    it('Returns null when there are no manuscripts in the db', async () => {
      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBe(null)
    })

    it('Returns null when user has no manuscripts in the db (db not empty)', async () => {
      await Manuscript.save({
        createdBy: '9f72f2b8-bb4a-43fa-8b80-c7ac505c8c5f',
        meta: { title: 'title' },
        status: 'INITIAL',
      })
      await Manuscript.save({
        createdBy: 'bcd735c6-9b62-441a-a085-7d1e8a7834c6',
        meta: { title: 'title 2' },
        status: 'QA',
      })

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBeNull()
    })

    it('Returns manuscript object when user has one manuscripts in the db (db not empty)', async () => {
      await Manuscript.save({
        createdBy: '9f72f2b8-bb4a-43fa-8b80-c7ac505c8c5f',
        meta: {
          title: 'title',
        },
        status: 'INITIAL',
      })
      await Manuscript.save({
        createdBy: 'bcd735c6-9b62-441a-a085-7d1e8a7834c6',
        meta: {
          title: 'title 2',
        },
        status: 'QA',
      })
      await Manuscript.save({
        createdBy: userId,
        meta: {
          title: 'mine',
        },
        status: 'INITIAL',
      })

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).not.toBeNull()
      expect(manuscript.meta.title).toBe('mine')
    })
  })

  describe('createSubmission', () => {
    it('fails if no authenticated user', async () => {
      await expect(Mutation.createSubmission({}, {}, {})).rejects.toThrow(
        'Not logged in',
      )
    })

    it('adds new manuscript to the db for current user with status INITIAL', async () => {
      const manuscript = await Mutation.createSubmission(
        {},
        {},
        { user: userId },
      )

      const manuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].id).toBe(manuscript.id)
    })
  })

  describe('updateSubmission', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new()
      const manuscript = await Manuscript.save(blankManuscript)
      const manuscriptInput = { id: manuscript.id }
      await expect(
        Mutation.updateSubmission(
          {},
          { data: manuscriptInput },
          { user: badUserId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('updates the current submission for user with data', async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const manuscript = await Manuscript.save(blankManuscript)
      const manuscriptInput = {
        id: manuscript.id,
        meta: {
          title: 'New Title',
        },
        coverLetter: 'this is some long text',
      }

      await Mutation.updateSubmission(
        {},
        {
          data: manuscriptInput,
          isAutoSave: true,
        },
        { user: userId },
      )

      const actualManuscript = await Manuscript.find(manuscript.id, userId)
      expect(actualManuscript).toMatchObject(manuscriptInput)
    })
  })

  describe('finishSubmission', () => {
    let id, initialManuscript
    const fullManuscript = {
      meta: {
        title: 'My manuscript',
        articleType: 'research-article',
        subjects: ['cancer-biology'],
      },
      suggestedSeniorEditors: ['ab12', 'cd34'],
      opposedSeniorEditors: [],
      suggestedReviewingEditors: ['ef56', 'gh78'],
      opposedReviewingEditors: [],
      suggestedReviewers: [
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
      ],
      opposedReviewers: [],
      opposedReviewersReason: '',
      suggestionsConflict: false,
      coverLetter: 'my cover letter',
      author: {
        firstName: 'Firstname',
        lastName: 'Lastname',
        email: 'mymail@mail.com',
        aff: 'Institution Inc',
      },
      previouslyDiscussed: '',
      previouslySubmitted: [],
      cosubmission: [],
      submitterSignature: 'Sneha Berry',
      disclosureConsent: true,
    }

    beforeEach(async () => {
      jest.clearAllMocks()

      initialManuscript = lodash.cloneDeep(emptyManuscript)
      initialManuscript.createdBy = userId
      initialManuscript.status = 'INITIAL'
      initialManuscript.files = [
        {
          url: 'fake-path.pdf',
          filename: 'FakeManuscript.pdf',
          type: 'MANUSCRIPT_SOURCE',
        },
      ]
      initialManuscript.teams = []

      const manuscript = await Manuscript.save(initialManuscript)
      id = manuscript.id
    })

    it('stores data with a new status of QA', async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        { data: manuscript },
        { user: userId },
      )

      expect(returnedManuscript.status).toBe('QA')

      const storedManuscript = await Manuscript.find(id, userId)
      expect(storedManuscript.status).toBe('QA')
      expect(storedManuscript.meta.title).toBe('My manuscript')
    })

    it('removes blank optional reviewer rows', async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      manuscript.suggestedReviewers = [
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: '', email: '' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
        { name: '', email: '' },
      ]
      await Mutation.finishSubmission(
        {},
        { data: manuscript },
        { user: userId },
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
      const blankManuscript = Manuscript.new()
      const manuscript = await Manuscript.save(blankManuscript)
      const manuscriptInput = { id: manuscript.id }
      await expect(
        Mutation.finishSubmission(
          {},
          { data: manuscriptInput },
          { user: badUserId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      await expect(
        Mutation.finishSubmission(
          {},
          { data: badManuscript },
          { user: userId },
        ),
      ).rejects.toThrow()
    })

    it('fails when manuscript has bad data types', async () => {
      const badManuscript = lodash.cloneDeep(fullManuscript)
      lodash.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      await expect(
        Mutation.finishSubmission(
          {},
          { data: badManuscript },
          { user: userId },
        ),
      ).rejects.toThrow(
        '"title" is not allowed. "manuscriptType" is not allowed',
      )
    })

    it('sends email and updates status when export fails', async () => {
      jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
      mecaExport.mockImplementationOnce(() =>
        Promise.reject(new Error('Broked')),
      )

      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      await Mutation.finishSubmission(
        {},
        { data: manuscript },
        { user: userId },
      )

      // resolver doesn't wait for export to complete so just keep retrying for a second
      for (let i = 0; i < 100 && mailer.getMails().length === 0; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      expect(mailer.getMails()).toMatchObject([
        {
          to: 'test@example.com',
          subject: 'MECA export failed',
        },
      ])
      expect(logger.error).toHaveBeenCalled()
      const updatedManuscript = await Manuscript.find(manuscript.id, userId)
      expect(updatedManuscript.status).toBe('FAILED_MECA_EXPORT')
    })
  })

  describe('uploadManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new()
      const manuscript = await Manuscript.save(blankManuscript)
      await expect(
        Mutation.uploadManuscript(
          {},
          { id: manuscript.id },
          { user: badUserId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    // TODO subscribe to uploadProgress before this or mock
  })
})
