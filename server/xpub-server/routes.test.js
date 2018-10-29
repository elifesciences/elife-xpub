jest.mock('@pubsweet/db-manager')

const express = require('express')
const supertest = require('supertest')
const AWS = require('aws-sdk')
const dbManager = require('@pubsweet/db-manager')

describe('ping route test', () => {
  let routes
  let mockS3Value
  let mockError

  AWS.S3 = jest.fn().mockImplementation(() => ({
    listObjects(params, cb) {
      cb(mockError, { Contents: mockS3Value })
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
    mockS3Value = [{ a: 1 }, { b: 1 }]
    mockError = null
  })

  it('returns success pointing ping endpoint', async () => {
    dbManager.dbExists.mockResolvedValue(14)
    const request = makeApp()
    await request.get('/ping').expect(200)
  })

  describe('Response Errors', () => {
    it('returns failure when an invalid response is returned from the database', async () => {
      dbManager.dbExists.mockResolvedValue(null)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('Database Error')
    })

    it('returns failure when an invalid response is returned from S3', async () => {
      mockS3Value = null
      dbManager.dbExists.mockResolvedValue(17)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('S3 Error')
    })

    it('both S3 and database return invalid responses', async () => {
      mockS3Value = null
      dbManager.dbExists.mockResolvedValue(0)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toEqual('Database Error')
      expect(response.body[1]).toEqual('S3 Error')
    })
  })

  describe('Connection Errors', () => {
    it('returns connection error on S3', async () => {
      mockS3Value = null
      mockError = new Error('connection failed')
      dbManager.dbExists.mockResolvedValue(14)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('S3 Error')
    })

    it('returns connection error on database', async () => {
      dbManager.dbExists.mockRejectedValue(new Error('connection Error'))
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('Database Error')
    })

    it('both returns connection errors', async () => {
      mockS3Value = null
      mockError = new Error('connection failed')
      dbManager.dbExists.mockRejectedValue(new Error('connection Error'))
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toEqual('Database Error')
      expect(response.body[1]).toEqual('S3 Error')
    })
  })
})
