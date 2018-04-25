const supertest = require('supertest')
const app = require('pubsweet-server/src/').configureApp(require('express')())
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
const authentication = require('pubsweet-server/src/authentication')
const { save } = require('../db-helpers/')
const _ = require('lodash')

const mockUuid = 'd2aeea36-88fc-47e6-94bc-85a6e28f53da'

jest.mock('uuid', () => ({ v4: jest.fn(() => mockUuid) }))

const userData = {
  username: 'testuser',
  orcid: 'testuser-orcid-id',
}

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
  },
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
    const dbManuscript = _.merge({}, manuscript, {
      submissionMeta: { createdBy: request.userId },
    })
    await save(dbManuscript)

    const expectedManuscript = _.merge({}, manuscript, { id: mockUuid })

    const query = `
      query CurrentSubmission {
        currentSubmission {
          id
          title
          source
          submissionMeta {
            stage
            author {
              firstName
              lastName
              email
              institution
            }
          }
        }
      }
    `

    const { body } = await request(query)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toMatchObject(expectedManuscript)
  })

  it('Returns empty object when user does not have any created manuscripts', async () => {
    const dbManuscript = _.merge({}, manuscript, {
      submissionMeta: { createdBy: 'b0baef74-19b1-45ab-b09d-4bfda191d8b4' },
    })
    await save(dbManuscript)

    const query = `
      query CurrentSubmission {
        currentSubmission {
          id
          title
          source
          submissionMeta {
            stage
            author {
              firstName
              lastName
              email
              institution
            }
          }
        }
      }
    `

    const { body } = await request(query)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toBe(null)
  })
})
