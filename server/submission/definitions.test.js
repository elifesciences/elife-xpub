const supertest = require('supertest')
const app = require('pubsweet-server/src/').configureApp(require('express')())
const { createTables } = require('@pubsweet/db-manager')
const User = require('pubsweet-server/src/models/User')
const authentication = require('pubsweet-server/src/authentication')
const { save, select, selectId } = require('../db-helpers/')
const _ = require('lodash')

const userData = {
  username: 'testuser',
  orcid: 'testuser-orcid-id',
}

const getClient = async () => {
  const user = new User(userData)
  const { id: userId } = await user.save()

  // TODO test send(query), send(mutation)
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
        createdBy: request.userId,
        stage: 'INITIAL',
        author: {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'email@example.com',
          institution: 'institution',
        },
      },
    }
    await save(expectedManuscript)

    // query to get it
    const query = `
        query CurrentSubmission {
          currentSubmission {
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
        }`

    const { body } = await request(query)
    expect(body.errors).toBeUndefined()

    // get rid of createdBy
    delete expectedManuscript.submissionMeta.createdBy
    expect(body.data.currentSubmission).toMatchObject(expectedManuscript)
  })

  it('Returns empty object when there are no manuscripts in the db', async () => {
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
        }`
    const { body } = await request(query)
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
        }`

    // null for current user
    const { body } = await request(query)
    expect(body.errors).toBeUndefined()
    expect(body.data.currentSubmission).toBe(null)
  })

  it('createSubmission adds new manuscript to the db for current user with stage INITIAL', async () => {
    const query = `
            mutation CreateSubmission {
                createSubmission {
                    id
                }
            }
        `
    await request(query)

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
    // TODO manuscriptToDb
    const manuscript = {
      title: 'title',
      source: 'source',
      type: 'manuscript',
      submissionMeta: {
        createdBy: request.userId,
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
    const id = await save(manuscript)

    // TODO better way to do this
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
    const query = `
            mutation {
                updateSubmission(data: {
                    id: "${id}",
                    title: "${newFormData.data.title}",
                    submissionMeta: {
                        coverLetter: "${
                          newFormData.data.submissionMeta.coverLetter
                        }",
                        author: {
                            firstName: "${
                              newFormData.data.submissionMeta.author.firstName
                            }",
                            lastName: "${
                              newFormData.data.submissionMeta.author.lastName
                            }",
                            email: "${
                              newFormData.data.submissionMeta.author.email
                            }",
                            institution: "${
                              newFormData.data.submissionMeta.author.institution
                            }"
                        },
                        correspondent: {
                            firstName: "${
                              newFormData.data.submissionMeta.correspondent
                                .firstName
                            }",
                            lastName: "${
                              newFormData.data.submissionMeta.correspondent
                                .lastName
                            }",
                            email: "${
                              newFormData.data.submissionMeta.correspondent
                                .email
                            }",
                            institution: "${
                              newFormData.data.submissionMeta.correspondent
                                .institution
                            }"
                        }
                    }
                }) {
                    id
                }
            }
        `
    /* const query = ` */
    /*     mutation { */
    /*         updateSubmission(data: ${JSON.stringify(newFormData.data)}) { */
    /*             id */
    /*         } */
    /*     } */
    /* `; */
    /* const query = ` */
    /*     mutation { */
    /*         updateSubmission(data: ${newFormData.data}) { */
    /*             id */
    /*         } */
    /*     } */
    /* `; */
    await request(query)

    // check new values in db
    const rows = await selectId(id)
    // console.log(JSON.stringify(rows[0], null, 2));
    const expectedManuscript = _.merge(manuscript, newFormData.data)
    // console.log(JSON.stringify(expectedManuscript, null, 2));
    delete expectedManuscript.id
    expect(rows[0].data).toMatchObject(expectedManuscript)
  })
})
