jest.mock('pubsweet-server/src/graphql/pubsub', () => ({
  getPubsub: () => Promise.resolve({ publish: jest.fn() }),
  asyncIterators: {},
}))
jest.mock('@pubsweet/logger')

const config = require('config')
const fs = require('fs-extra')
const stream = require('stream')
const logger = require('@pubsweet/logger')
const { createTables } = require('@elifesciences/component-model')
const mailer = require('@pubsweet/component-send-email')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const startS3Server = require('@elifesciences/component-service-s3/mock')

const ScienceBeamApi = require('../services/scienceBeamApi')
const { Mutation } = require('.')
const { userData, badUserData } = require('./index.test.data')
const replaySetup = require('../../../../test/helpers/replay-setup')
const { S3Storage } = require('@elifesciences/component-service-s3')

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await createTables(true)
    const [user] = await Promise.all([
      User.createWithIdentity(profileId),
      User.createWithIdentity(badProfileId),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('uploadManuscript', () => {
    let s3Server

    beforeEach(async () => {
      const server = await startS3Server({
        ...config.get('aws.credentials'),
        ...config.get('aws.s3'),
      })
      s3Server = server.instance
    })

    afterEach(done => {
      s3Server.close(done)
    })

    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = new Manuscript()
      blankManuscript.createdBy = userId
      const manuscript = await blankManuscript.save()

      await expect(
        Mutation.uploadManuscript(
          {},
          { id: manuscript.id },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('saves manuscript to S3', async () => {
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const fileUpload = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        mimetype: 'application/pdf',
      }
      await Mutation.uploadManuscript(
        {},
        { id, file: fileUpload, fileSize: 73947 },
        { user: profileId },
      )

      const loadedManuscript = await Manuscript.find(id, userId)
      const file = await loadedManuscript.getSource()
      const pdfBinary = await S3Storage.getContent(file)
      expect(pdfBinary.toString().substr(0, 6)).toEqual('%PDF-1')
      expect(loadedManuscript.files[0].type).toEqual('MANUSCRIPT_SOURCE')
      expect(loadedManuscript.files[0].filename).toEqual(fileUpload.filename)
      expect(loadedManuscript.files[0].mimeType).toEqual(fileUpload.mimetype)
      expect(loadedManuscript.files[0].status).toEqual('STORED')
    })

    it('fails if S3 upload fails', async () => {
      jest
        .spyOn(S3Storage, 'putContent')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('Failed to persist file')),
        )
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        mimetype: 'application/pdf',
      }
      await expect(
        Mutation.uploadManuscript(
          {},
          { id, file, fileSize: 73947 },
          { user: profileId },
        ),
      ).rejects.toThrow('Failed to persist file')

      const manuscript = await Manuscript.find(id, userId)
      expect(manuscript.files).toHaveLength(0)
    })

    it('sets empty title if ScienceBeam fails', async () => {
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        mimetype: 'application/pdf',
      }

      jest.spyOn(ScienceBeamApi, 'extractSemantics').mockRejectedValueOnce({
        error: {
          code: 'ETIMEDOUT',
          connect: false,
          message: 'timed out',
        },
      })

      const manuscript = await Mutation.uploadManuscript(
        {},
        { id, file, fileSize: 73947 },
        { user: profileId },
      )
      expect(manuscript.meta.title).toBe('')
      expect(manuscript).toMatchObject({
        id,
        meta: { title: '' },
        files: [{ filename: 'manuscript.pdf' }],
      })
      expect(logger.warn).toHaveBeenCalled()
    })

    it('extracts title from PDF', async () => {
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        mimetype: 'application/pdf',
      }
      const manuscript = await Mutation.uploadManuscript(
        {},
        { id, file, fileSize: 73947 },
        { user: profileId },
      )
      expect(manuscript).toMatchObject({
        id,
        meta: {
          title:
            'The Relationship Between Lamport Clocks and Interrupts Using Obi',
        },
        files: [{ filename: 'manuscript.pdf' }],
      })
    })

    it(`fails if manuscript size is bigger than ${config.get(
      'fileUpload.maxSizeMB',
    )}MB`, async () => {
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()

      const maxFileSize = config.get('fileUpload.maxSizeMB')
      const fileSize = maxFileSize * 1e6 + 1
      const bufferStream = new stream.PassThrough()
      bufferStream.end(Buffer.alloc(fileSize))
      const file = {
        filename: 'manuscript.pdf',
        stream: bufferStream,
        mimetype: 'application/pdf',
      }
      await expect(
        Mutation.uploadManuscript(
          {},
          { id, file, fileSize },
          { user: profileId },
        ),
      ).rejects.toThrow(`File size shouldn't exceed ${maxFileSize}MB`)
    })

    it('replaces old manuscript file with new manuscript file', async () => {
      const blankManuscript = new Manuscript({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const createFile = fileName => ({
        filename: fileName,
        stream: fs.createReadStream(
          `${__dirname}/../../../../test/fixtures/dummy-manuscript-2.pdf`,
        ),
        mimetype: 'application/pdf',
      })
      let manuscript = await Mutation.uploadManuscript(
        {},
        { id, file: createFile('manuscript.pdf'), fileSize: 73947 },
        { user: profileId },
      )

      expect(manuscript.files).toHaveLength(1)
      expect(manuscript.files[0].filename).toBe('manuscript.pdf')

      manuscript = await Mutation.uploadManuscript(
        {},
        { id, file: createFile('manuscript2.pdf'), fileSize: 73947 },
        { user: profileId },
      )
      expect(manuscript.files).toHaveLength(1)
      expect(manuscript.files[0].filename).toBe('manuscript2.pdf')
    })
  })
})
