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
const Joi = require('joi')

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
      .send({
        query: jsonToGraphQLQuery(query, { pretty: true }),
      })
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

    const { body } = await request(query)
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

    const { body } = await request(query)
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
    const { body } = await request(query)

    const manuscripts = await select({
      'submissionMeta.createdBy': request.userId,
      'submissionMeta.stage': 'INITIAL',
    })
    expect(manuscripts.length).toBeGreaterThan(0)
    expect(manuscripts[0].id).toBe(body.data.createSubmission.id)

    console.log(manuscripts[0].suggestedSeniorEditors)
    const schema = Joi.object()
      .keys({
        id: Joi.string().required(),
        title: Joi.string()
          .required()
          .allow(''),
        manuscriptType: Joi.string()
          .required()
          .allow(''),
        source: Joi.string()
          .required()
          .allow(''),
        suggestedSeniorEditors: Joi.array()
          .items(Joi.string().allow(''))
          .required(),
        opposedSeniorEditors: Joi.array()
          .items(
            Joi.object().keys({ name: Joi.string(), reason: Joi.string() }),
          )
          .required(),
        suggestedReviewingEditors: Joi.array()
          .items(Joi.string().allow(''))
          .required(),
        opposedReviewingEditors: Joi.array()
          .items(
            Joi.object().keys({ name: Joi.string(), reason: Joi.string() }),
          )
          .required(),
        suggestedReviewers: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.string().allow(''),
              email: Joi.string().allow(''),
            }),
          )
          .required(),
        opposedReviewers: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.string(),
              email: Joi.string(),
              reason: Joi.string(),
            }),
          )
          .required(),
        noConflictOfInterest: Joi.boolean().required(),
        submissionMeta: Joi.object().keys({
          coverLetter: Joi.string()
            .required()
            .allow(''),
          author: Joi.object().keys({
            firstName: Joi.string()
              .required()
              .allow(''),
            lastName: Joi.string()
              .required()
              .allow(''),
            email: Joi.string()
              .required()
              .allow(''),
            institution: Joi.string()
              .required()
              .allow(''),
          }),
          hasCorrespondent: Joi.boolean().required(),
          correspondent: Joi.object().keys({
            firstName: Joi.string()
              .required()
              .allow(''),
            lastName: Joi.string()
              .required()
              .allow(''),
            email: Joi.string()
              .required()
              .allow(''),
            institution: Joi.string()
              .required()
              .allow(''),
          }),
          stage: Joi.string().required(),
          discussedPreviously: Joi.boolean().required(),
          discussion: Joi.string()
            .required()
            .allow(''),
          consideredPreviously: Joi.boolean().required(),
          previousArticle: Joi.string()
            .required()
            .allow(''),
          cosubmission: Joi.boolean().required(),
          cosubmissionTitle: Joi.string()
            .required()
            .allow(''),
          cosubmissionId: Joi.string()
            .required()
            .allow(''),
        }),
      })
      .required()
    const { error } = Joi.validate(manuscripts[0], schema)
    expect(error).toBeNull()
  })

  it('updateSubmission updates the current submission for user with data', async () => {
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
    await request(query)

    const rows = await selectId(id)
    const expectedManuscript = _.merge(manuscript, newFormData.data)
    expect(manuscriptDbToGql(rows[0].data, id)).toMatchObject(
      expectedManuscript,
    )
  })
})
