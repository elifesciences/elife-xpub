const supertest = require('supertest')
const app = require('pubsweet-server/src/').configureApp(require('express')())
const { createTables } = require('@pubsweet/db-manager')

const getClient = async () => {
  const User = require('pubsweet-server/src/models/User')
  const authentication = require('pubsweet-server/src/authentication')

  const user = new User({
    username: 'testuser',
    orcid: 'testuser-orcid-id',
  })
  await user.save()

  return query =>
    supertest(app)
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${authentication.token.create(user)}` })
}

describe('Submission', () => {
  let request

  beforeEach(async () => {
    await createTables(true)
    request = await getClient()
  })

  it('Gets form data', async () => {
    const query = `
      query CurrentSubmission {
        currentSubmission {
          id
          title
          source
        }
      }
    `

    const { body } = await request(query)
    expect(body.errors).toHaveLength(0)
  })
})
