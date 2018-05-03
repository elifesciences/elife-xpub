const supertest = require('supertest')
const _ = require('lodash')
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
const { jsonToGraphQLQuery } = require('json-to-graphql-query')

const userData = {
  username: 'testuser',
  orcid: 'testuser-orcid-id',
}

const getClient = async () => {
  const user = new User(userData)
  const { id: userId } = await user.save()

  const request = query =>
    supertest(app)
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${authentication.token.create(user)}` })

  request.userId = userId
  return request
}

describe('Submission', () => {
  let request

  beforeEach(async () => {
    await createTables(true)
    request = await getClient()
  })

  it('Gets form data', async () => {
    // manuscript in db
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
    await save(manuscriptGqlToDb(expectedManuscript, request.userId))

    // query to get it
    const query = {
      query: {
        currentSubmission: {
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
    const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })

    const { body } = await request(graphqlQuery)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toMatchObject(expectedManuscript)
  })

  it('Returns empty object when there are no manuscripts in the db', async () => {
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
    const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })
    const { body } = await request(graphqlQuery)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toBe(null)
  })

  it('Returns empty object when user has no manuscripts in the db (db not empty)', async () => {
    // add some manuscripts to db
    await save({
      title: 'title',
      source: 'source',
      submissionMeta: {
        createdBy: 'fake1',
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
    const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })

    // null for current user
    const { body } = await request(graphqlQuery)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toBe(null)
  })

  it('createSubmission adds new manuscript to the db for current user with stage INITIAL', async () => {
    const query = {
      mutation: {
        createSubmission: {
          id: true,
        },
      },
    }
    const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })
    await request(graphqlQuery)

    // check db has manuscript
    const rows = await select({
      'submissionMeta.createdBy': request.userId,
      'submissionMeta.stage': 'INITIAL',
    })
    expect(rows.length).toBeGreaterThan(0)
    // TODO check for empty?
  })

  it('updateSubmission updates the current submission for user with data', async () => {
    // manuscript in db for current user
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
    const id = await save(manuscriptGqlToDb(manuscript, request.userId))
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
    const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })
    await request(graphqlQuery)

    // check new values in db
    const rows = await selectId(id)
    const expectedManuscript = _.merge(manuscript, newFormData.data)
    expect(manuscriptDbToGql(rows[0].data, id)).toMatchObject(
      expectedManuscript,
    )
  })
})
