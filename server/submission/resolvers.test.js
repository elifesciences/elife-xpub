const supertest = require('supertest')
const _ = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const { jsonToGraphQLQuery } = require('json-to-graphql-query')
const app = require('pubsweet-server/src/').configureApp(require('express')())
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
const authentication = require('pubsweet-server/src/authentication')
const {
  save,
  select,
  selectId,
  manuscriptGqlToDb,
  manuscriptDbToGql,
} = require('../db-helpers/')
const {
  Mutation: { uploadManuscript },
} = require('./resolvers')
const { emptyManuscript } = require('./definitions')

const replaySetup = require('../../test/helpers/replay-setup')

const userData = {
  username: 'testuser',
  orcid: '0000-0003-3146-0256',
  oauth: { accessToken: 'f7617529-f46a-40b1-99f4-4181859783ca' },
}

describe('Submission', () => {
  let request
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
    request = query =>
      supertest(app)
        .post('/graphql')
        .send({
          query: jsonToGraphQLQuery(query, { pretty: true }),
        })
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${authentication.token.create(user)}` })
  })

  describe('currentSubmission', () => {
    const query = {
      query: {
        currentSubmission: {
          id: true,
          title: true,
          source: true,
          submissionMeta: {
            stage: true,
            author: {
              firstName: true,
              lastName: true,
              email: true,
              institution: true,
            },
          },
        },
      },
    }

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

      const { body } = await request(query)
      expect(body.errors).toBeUndefined()
      expect(body.data.currentSubmission).toMatchObject(expectedManuscript)
    })

    it('Returns empty object when there are no manuscripts in the db', async () => {
      const { body } = await request(query)
      expect(body.errors).toBeUndefined()
      expect(body.data.currentSubmission).toBe(null)
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

      const { body } = await request(query)
      expect(body.errors).toBeUndefined()
      expect(body.data.currentSubmission).toBe(null)
    })
  })

  describe('createSubmission', () => {
    it('adds new manuscript to the db for current user with stage INITIAL', async () => {
      const query = {
        mutation: {
          createSubmission: {
            id: true,
          },
        },
      }
      const { body } = await request(query)

      const manuscripts = await select({
        'submissionMeta.createdBy': userId,
        'submissionMeta.stage': 'INITIAL',
      })
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].id).toBe(body.data.createSubmission.id)
    })

    it('an error in the orcid request leaves fields unpopulated', async () => {
      replaySetup('error')
      const query = {
        mutation: {
          createSubmission: {
            submissionMeta: {
              author: {
                firstName: true,
                lastName: true,
                email: true,
                institution: true,
              },
            },
          },
        },
      }
      const { body } = await request(query)
      expect(body.data.createSubmission).toEqual({
        submissionMeta: {
          author: {
            firstName: '',
            lastName: '',
            email: '',
            institution: '',
          },
        },
      })
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
          hasCorrespondent: false,
          correspondent: {
            firstName: '',
            lastName: '',
            email: '',
            institution: '',
          },
        },
      }
      const id = await save(manuscriptGqlToDb(manuscript, userId))
      const newFormData = {
        data: {
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
            correspondent: {
              firstName: 'todo first name',
              lastName: 'todo',
              email: 'todo@mail.com',
              institution: 'todo institution 1',
            },
          },
        },
      }
      const query = {
        mutation: {
          updateSubmission: {
            id: true,
            __args: {
              data: {
                id,
                ...newFormData.data,
              },
            },
          },
        },
      }
      await request(query)

      const rows = await selectId(id)
      const expectedManuscript = _.merge(manuscript, newFormData.data)
      expect(manuscriptDbToGql(rows[0].data, id)).toMatchObject(
        expectedManuscript,
      )
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

      // call resolver directly because setting up the multipart request is hard
      const response = await uploadManuscript({}, { id, file })

      expect(response).toMatchObject({
        id,
        title:
          'The Relationship Between Lamport Clocks and Interrupts Using Obi',
        files: [{ name: 'manuscript.pdf' }],
      })
    })
  })
})
