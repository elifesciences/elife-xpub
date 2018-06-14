const _ = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
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
  })

  describe('currentSubmission', () => {
    it('Gets form data', async () => {
      const expectedManuscript = {
        title: 'title',
        source: 'source',
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
        source: 'source',
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
        source: 'source 2',
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
        source: 'source',
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
