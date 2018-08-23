const lodash = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const User = require('../user')
const Manuscript = require('.')
const mailer = require('@pubsweet/component-send-email')
const { Mutation, Query } = require('./resolvers')

const replaySetup = require('../../../../test/helpers/replay-setup')

const userData = {
  username: 'testuser',
  email: 'test@example.com',
  orcid: '0000-0003-3146-0256',
  oauth: { accessToken: 'f7617529-f46a-40b1-99f4-4181859783ca' },
}

describe('Submission', () => {
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await Promise.all([
      fs.remove(config.get('pubsweet-server.uploads')),
      createTables(true),
    ])
    const user = await User.save(userData)
    userId = user.id
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

    it('Returns empty object when there are no manuscripts in the db', async () => {
      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBe(null)
    })

    it('Returns null object when user has no manuscripts in the db (db not empty)', async () => {
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

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBe(null)
    })
  })

  describe('createSubmission', () => {
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

      const actualManuscript = await Manuscript.find(manuscript.id)
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
    }

    beforeEach(async () => {
      initialManuscript = {
        createdBy: userId,
        status: 'INITIAL',
        files: [
          {
            url: 'fake-path.pdf',
            filename: 'FakeManuscript.pdf',
            type: 'MANUSCRIPT_SOURCE',
          },
        ],
        teams: [],
      }
      const manuscript = await Manuscript.save(initialManuscript)
      id = manuscript.id
    })

    it('stores data with a new status of QA', async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        {
          data: manuscript,
        },
        { user: userId },
      )

      expect(returnedManuscript.status).toBe('QA')

      const storedManuscript = await Manuscript.find(id)
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
        {
          data: manuscript,
        },
        { user: userId },
      )

      const storedManuscript = await Manuscript.find(id)
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

    it("sends a verification email if the submitter is not the corresponding author - email address entered on step 1 of the wizard differs from submitter's login email", async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      await Mutation.finishSubmission(
        {},
        {
          data: manuscript,
        },
        { user: userId },
      )

      expect(mailer.getMails()).toHaveLength(1)
    })

    it('does not send a verification email if the submitter is the corresponding author', async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      manuscript.author.email = userData.email
      await Mutation.finishSubmission(
        {},
        {
          data: manuscript,
        },
        { user: userId },
      )

      expect(mailer.getMails()).toHaveLength(0)
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      await Mutation.finishSubmission(
        {},
        {
          data: badManuscript,
        },
        { user: userId },
      ).catch(err => expect(err).toBeDefined())
      expect.assertions(1)
    })
    it('fails when manuscript has bad data types', async () => {
      const badManuscript = lodash.cloneDeep(fullManuscript)
      lodash.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      await Mutation.finishSubmission(
        {},
        {
          data: badManuscript,
        },
        { user: userId },
      ).catch(err => expect(err).toBeDefined())
      expect.assertions(1)
    })
  })

  describe('uploadManuscript', () => {
    // TODO subscribe to uploadProgress before this or mock
    it.skip('extracts title from PDF', async () => {
      const { id } = await Manuscript.save(Manuscript.new())
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        encoding: 'utf8',
        mimetype: 'application/pdf',
        size: 73947,
      }
      const manuscript = await Mutation.uploadManuscript(
        {},
        { id, file, fileSize: file.size },
      )
      expect(manuscript).toMatchObject({
        id,
        meta: {
          title:
            'The Relationship Between Lamport Clocks and Interrupts Using Obi',
        },
        files: [{ filename: 'manuscript.pdf' }],
      })
    })
  })
})
