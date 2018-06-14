const _ = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
const Email = require('@pubsweet/component-send-email')
const { save, select, selectId, manuscriptGqlToDb } = require('../db-helpers/')
const { Mutation, Query } = require('./resolvers')
const { emptyManuscript } = require('./definitions')

const replaySetup = require('../../test/helpers/replay-setup')

const userData = {
  username: 'testuser',
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
    Email.clearMails()
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
      const manuscript = {
        title: 'title',
        submissionMeta: {
          stage: 'INITIAL',
          author: {
            firstName: 'Firstname',
            lastName: 'Lastname',
            email: 'email@example.com',
            institution: 'institution',
          },
          coverLetter: '',
        },
      }
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
        },
        { user: userId },
      )

      const actualManuscript = await selectId(id)
      const expectedManuscript = _.merge(manuscript, manuscriptInput)
      expect(actualManuscript).toMatchObject(expectedManuscript)
    })
  })

  describe('finshSubmission', () => {
    function getInitialManuscript() {
      // userId is defined in beforeEach
      return {
        submissionMeta: {
          createdBy: userId,
          stage: 'INITIAL',
        },
        // this is here just to fake upload process
        files: [
          {
            url: 'fake-path.pdf',
            name: 'FakeManuscript.pdf',
            type: 'MANUSCRIPT_SOURCE',
          },
        ],
      }
    }
    const fullManuscript = {
      title: 'My Manuscript',
      manuscriptType: 'research-article',
      subjectAreas: ['cancer-biology'],
      suggestedSeniorEditors: ['Senior 1', 'Senior 2'],
      opposedSeniorEditors: [],
      suggestedReviewingEditors: ['Editor 1', 'Editor 2'],
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
        discussedPreviously: false,
        consideredPreviously: false,
        cosubmission: false,
      },
    }
    it('stores data to the backend with a new stage of QA', async () => {
      const initialManuscript = getInitialManuscript()
      const id = await save(manuscriptGqlToDb(initialManuscript, userId))
      const manuscript = _.cloneDeep(fullManuscript)
      manuscript.id = id
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        {
          data: manuscript
        },
        { user: userId }
      )

      expect(returnedManuscript.submissionMeta.stage).toBe('QA')

      const storedManuscript = await selectId(id)
      const expectedManuscript = _.merge(initialManuscript, manuscript)
      expectedManuscript.submissionMeta.stage = 'QA'
      expect(expectedManuscript).toMatchObject(storedManuscript)

      expect(Email.getMails()).toHaveLength(1)
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const initialManuscript = getInitialManuscript()
      const id = await save(manuscriptGqlToDb(initialManuscript, userId))
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        {
          data: badManuscript
        },
        { user: userId }
      ).catch(err => expect(err).toBeDefined())
      expect.assertions(1)
    })
    it('fails when manuscript has bad data types', async () => {
      const initialManuscript = getInitialManuscript()
      const id = await save(manuscriptGqlToDb(initialManuscript, userId))
      const badManuscript = _.cloneDeep(fullManuscript)
      _.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        {
          data: badManuscript
        },
        { user: userId }
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
