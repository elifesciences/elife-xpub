const lodash = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
const mailer = require('@pubsweet/component-send-email')
const { save, select, selectId, manuscriptGqlToDb } = require('../db-helpers/')
const { Mutation, Query } = require('./resolvers')
const { emptyManuscript } = require('./definitions')

const replaySetup = require('../../test/helpers/replay-setup')

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
    const user = new User(userData)
    await user.save()
    userId = user.id
    mailer.clearMails()
  })

  describe('editors', () => {
    it('returns a list of senior editors', async () => {
      const result = await Query.editors({}, { role: 'senior-editor' })
      expect(result).toHaveLength(40)
      expect(result[0]).toEqual({
        id: '8d7e57b3',
        institution: undefined,
        name: 'Richard Aldrich',
        subjectAreas: [
          'Structural Biology and Molecular Biophysics',
          'Neuroscience',
        ],
      })
    })
  })

  describe('currentSubmission', () => {
    it('Gets form data', async () => {
      const expectedManuscript = {
        title: 'title',
        submissionMeta: {
          stage: 'INITIAL',
          author: {
            firstName: 'Firstname',
            lastName: 'Lastname',
            email: 'email@example.com',
            institution: 'institution',
          },
        },
      }
      await save(manuscriptGqlToDb(expectedManuscript, userId))

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toMatchObject(expectedManuscript)
    })

    it('Returns empty object when there are no manuscripts in the db', async () => {
      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBe(null)
    })

    it('Returns null object when user has no manuscripts in the db (db not empty)', async () => {
      await save({
        title: 'title',
        submissionMeta: {
          createdBy: '9f72f2b8-bb4a-43fa-8b80-c7ac505c8c5f',
          stage: 'INITIAL',
          author: {
            firstName: 'Firstname 1',
            lastName: 'Lastname 1',
            email: 'email1@example.com',
            institution: 'institution 1',
          },
        },
      })
      await save({
        title: 'title 2',
        submissionMeta: {
          createdBy: 'bcd735c6-9b62-441a-a085-7d1e8a7834c6',
          stage: 'QA',
          author: {
            firstName: 'Firstname 2',
            lastName: 'Lastname 2',
            email: 'email2@example.com',
            institution: 'institution 2',
          },
        },
      })

      const manuscript = await Query.currentSubmission({}, {}, { user: userId })
      expect(manuscript).toBe(null)
    })
  })

  describe('createSubmission', () => {
    it('adds new manuscript to the db for current user with stage INITIAL', async () => {
      const manuscript = await Mutation.createSubmission(
        {},
        {},
        { user: userId },
      )

      const manuscripts = await select({
        'submissionMeta.createdBy': userId,
        'submissionMeta.stage': 'INITIAL',
      })
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].id).toBe(manuscript.id)
    })
  })

  describe('updateSubmission', () => {
    it('updates the current submission for user with data', async () => {
      const manuscript = lodash.merge({}, emptyManuscript)
      const id = await save(manuscriptGqlToDb(manuscript, userId))
      const manuscriptInput = {
        id,
        title: 'New Title',
        submissionMeta: {
          coverLetter: 'this is some long text',
          author: {
            firstName: 'todo first name',
            lastName: 'todo last name',
            email: 'todo@mail.com',
            institution: 'TODO',
          },
        },
      }

      await Mutation.updateSubmission(
        {},
        {
          data: manuscriptInput,
          isAutoSave: true,
        },
        { user: userId },
      )

      const actualManuscript = await selectId(id)
      const expectedManuscript = lodash.merge({}, manuscriptInput)
      expect(actualManuscript).toMatchObject(expectedManuscript)
    })
  })

  describe('finishSubmission', () => {
    let id, initialManuscript
    const fullManuscript = {
      title: 'My Manuscript',
      manuscriptType: 'research-article',
      subjectAreas: ['cancer-biology'],
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
      noConflictOfInterest: false,
      submissionMeta: {
        coverLetter: 'my cover letter',
        author: {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'mymail@mail.com',
          institution: 'Institution Inc',
        },
        hasCorrespondent: false,
        discussion: false,
        previousArticle: false,
        cosubmission: [],
      },
    }

    beforeEach(async () => {
      initialManuscript = {
        submissionMeta: {
          createdBy: userId,
          stage: 'INITIAL',
        },
        files: [
          {
            url: 'fake-path.pdf',
            name: 'FakeManuscript.pdf',
            type: 'MANUSCRIPT_SOURCE',
          },
        ],
      }
      id = await save(manuscriptGqlToDb(initialManuscript, userId))
    })

    it('stores data to the backend with a new stage of QA', async () => {
      const manuscript = lodash.cloneDeep(fullManuscript)
      manuscript.id = id
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        {
          data: manuscript,
        },
        { user: userId },
      )

      expect(returnedManuscript.submissionMeta.stage).toBe('QA')

      const storedManuscript = await selectId(id)
      const expectedManuscript = lodash.merge(initialManuscript, manuscript)
      expectedManuscript.submissionMeta.stage = 'QA'
      expect(expectedManuscript).toMatchObject(storedManuscript)
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
      manuscript.submissionMeta.author.email = userData.email
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
    it('extracts title from PDF', async () => {
      const id = await save(manuscriptGqlToDb(emptyManuscript, userId))
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        encoding: 'utf8',
        mimetype: 'application/pdf',
      }

      const manuscript = await Mutation.uploadManuscript({}, { id, file })
      expect(manuscript).toMatchObject({
        id,
        title:
          'The Relationship Between Lamport Clocks and Interrupts Using Obi',
        files: [{ name: 'manuscript.pdf' }],
      })
    })
  })
})
