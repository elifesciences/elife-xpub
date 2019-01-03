const { createTables } = require('@pubsweet/db-manager')
const File = require('.')
const config = require('config')
const startS3rver = require('../../../xpub-server/test/mock-s3-server')

describe('Manuscript', () => {
  beforeEach(() => createTables(true))

  describe('delete File', () => {
    let s3Server

    beforeEach(async () => {
      const server = await startS3rver({
        ...config.get('aws.credentials'),
        ...config.get('aws.s3'),
      })
      s3Server = server.instance
    })

    afterEach(done => {
      s3Server.close(done)
    })

    it('if should fail if id is not provided once delete content', async () => {
      const file = new File()
      let response
      const error = new Error('File has no ID, or is invalid')
      try {
        response = await file.deleteContent()
      } catch (err) {
        response = err
      }
      expect(response).toEqual(error)
    })

    it('if should delete the s3 content', async () => {
      const file = new File({
        manuscriptId: 1,
        id: 1,
        url: '/an/url',
      })
      const response = await file.deleteContent()
      expect(response).toBeTruthy()
    })

    it('if should return an error deleting the s3 content, if there is no access to S3', async () => {
      jest
        .spyOn(File.prototype, 'deleteContent')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('Failed to persist file')),
        )
      const file = new File({
        manuscriptId: 1,
        id: 1,
        url: '/an/url',
      })
      try {
        await file.deleteContent()
      } catch (error) {
        expect(error.message).toBe('Failed to persist file')
      }
    })
  })
})
