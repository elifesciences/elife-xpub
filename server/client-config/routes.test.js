const express = require('express')
const supertest = require('supertest')
const AWS = require('aws-sdk')

jest.mock('@pubsweet/db-manager/src/helpers/db-exists.js', () =>
  jest.fn().mockResolvedValue(14),
)
AWS.S3 = jest.fn().mockImplementation(() => ({
  getObject(params, cb) {
    return {
      promise: () => ({ Body: 'ok' }),
    }
  },
}))

describe('Client config handler', () => {
  let routes

  const makeApp = () => {
    const app = express()
    routes(app)
    return supertest(app)
  }

  beforeEach(() => {
    jest.mock('config', () => ({
      publicConfig: {
        isPublic: true,
        key: 'value',
      },
      privateConfig: {
        secret: 'password',
      },
      aws: {
        credentials: {
          region: '',
          accessKeyId: '',
          secretAccessKey: '',
        },
        s3: {
          s3ForcePathStyle: true,
          params: {
            Bucket: 'dev-elife-xpub',
          },
        },
      },
    }))

    routes = require('./routes')
  })

  it('returns javascript', async () => {
    const request = makeApp()
    const response = await request.get('/config.js').expect(200)
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('javascript'),
    )
  })

  it('returns a response containing public config', async () => {
    const request = makeApp()
    const response = await request.get('/config.js').expect(200)
    expect(response.text).toMatchSnapshot()
  })

  it('returns something pointing ping', async () => {
    const request = makeApp()
    const response = await request.get('/ping').expect(200)
    expect(response.text).toMatchSnapshot()
  })
})
