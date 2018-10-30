const express = require('express')
const supertest = require('supertest')
const AWS = require('aws-sdk')
const dbManager = require('@pubsweet/db-manager')

jest.mock('@pubsweet/db-manager')

describe('ping route test', () => {
  let routes
  let mockS3Value = 'ok'

  AWS.S3 = jest.fn().mockImplementation(() => ({
    getObject(params, cb) {
      return {
        promise: () => ({ Body: mockS3Value }),
      }
    },
  }))

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

  it('returns something pointing ping', async () => {
    dbManager.dbExists.mockResolvedValue(14)
    const request = makeApp()
    await request.get('/ping').expect(200)
  })

  it('returns failure once no connectivity to database', async () => {
    dbManager.dbExists.mockResolvedValue(null)
    const request = makeApp()
    const response = await request.get('/ping').expect(410)
    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toEqual('Database Error')
  })

  it('returns failure once no connectivity to S3', async () => {
    mockS3Value = null
    dbManager.dbExists.mockResolvedValue(17)
    const request = makeApp()
    const response = await request.get('/ping').expect(410)
    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toEqual('S3 Connection Error')
  })

  it('returns more than one failure', async () => {
    mockS3Value = null
    dbManager.dbExists.mockResolvedValue(0)
    const request = makeApp()
    const response = await request.get('/ping').expect(410)
    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toEqual('Database Error')
    expect(response.body[1]).toEqual('S3 Connection Error')
  })
})
