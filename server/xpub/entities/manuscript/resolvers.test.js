jest.mock('@elifesciences/xpub-meca-export', () =>
  jest.fn(() => Promise.resolve()),
)

const lodash = require('lodash')
const config = require('config')
const fs = require('fs-extra')
const stream = require('stream')
const logger = require('@pubsweet/logger')
const { createTables } = require('@pubsweet/db-manager')
const mailer = require('@pubsweet/component-send-email')
const mecaExport = require('@elifesciences/xpub-meca-export')
const startS3rver = require('../../test/mock-s3-server')
const User = require('../user')
const FileManager = require('../file')
const { Mutation, Query } = require('./resolvers')
const Manuscript = require('.')
const {
  userData,
  badUserData,
  expectedManuscript,
  manuscriptInput,
} = require('./resolvers.test.data')

const replaySetup = require('../../../../test/helpers/replay-setup')

describe('Submission', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await Promise.all([
      fs.remove(config.get('pubsweet-server.uploads')),
      createTables(true),
    ])
    const [user] = await Promise.all([
      User.save(userData),
      User.save(badUserData),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('currentSubmission', () => {
    it('Gets form data', async () => {
      const manuscriptData = {
        createdBy: userId,
        meta: {
          title: 'title',
        },
        status: 'INITIAL',
      }
      await Manuscript.save(manuscriptData)

      const manuscript = await Query.currentSubmission(
        {},
        {},
        { user: profileId },
      )
      expect(manuscript).toMatchObject(manuscriptData)
    })

    it('Returns null when there are no manuscripts in the db', async () => {
      const manuscript = await Query.currentSubmission(
        {},
        {},
        { user: profileId },
      )
      expect(manuscript).toBe(null)
    })

    it('Returns null when user has no manuscripts in the db (db not empty)', async () => {
      await Manuscript.save({
        createdBy: '9f72f2b8-bb4a-43fa-8b80-c7ac505c8c5f',
        meta: { title: 'title' },
        status: 'INITIAL',
      })
      await Manuscript.save({
        createdBy: 'bcd735c6-9b62-441a-a085-7d1e8a7834c6',
        meta: { title: 'title 2' },
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      })

      const manuscript = await Query.currentSubmission(
        {},
        {},
        { user: profileId },
      )
      expect(manuscript).toBeNull()
    })

    it('Returns manuscript object when user has one manuscripts in the db (db not empty)', async () => {
      await Manuscript.save({
        createdBy: '9f72f2b8-bb4a-43fa-8b80-c7ac505c8c5f',
        meta: {
          title: 'title',
        },
        status: 'INITIAL',
      })
      await Manuscript.save({
        createdBy: 'bcd735c6-9b62-441a-a085-7d1e8a7834c6',
        meta: {
          title: 'title 2',
        },
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      })
      await Manuscript.save({
        createdBy: userId,
        meta: {
          title: 'mine',
        },
        status: 'INITIAL',
      })

      const manuscript = await Query.currentSubmission(
        {},
        {},
        { user: profileId },
      )
      expect(manuscript).not.toBeNull()
      expect(manuscript.meta.title).toBe('mine')
    })
  })

  describe('createSubmission', () => {
    it('fails if no authenticated user', async () => {
      await expect(Mutation.createSubmission({}, {}, {})).rejects.toThrow(
        'Not logged in',
      )
    })

    it('adds new manuscript to the db for current user with status INITIAL', async () => {
      const manuscript = await Mutation.createSubmission(
        {},
        {},
        { user: profileId },
      )

      const manuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(manuscripts.length).toBeGreaterThan(0)
      expect(manuscripts[0].id).toBe(manuscript.id)
    })
  })

  describe('updateSubmission', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new({ createdBy: userId })
      const manuscript = await Manuscript.save(blankManuscript)
      await expect(
        Mutation.updateSubmission(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('updates the current submission for user with data', async () => {
      const blankManuscript = Manuscript.new({ createdBy: userId })
      const manuscript = await Manuscript.save(blankManuscript)

      await Mutation.updateSubmission(
        {},
        {
          data: { id: manuscript.id, ...manuscriptInput },
          isAutoSave: true,
        },
        { user: profileId },
      )

      const actualManuscript = await Manuscript.find(manuscript.id, userId)
      expect(actualManuscript).toMatchObject(expectedManuscript)
    })
  })

  describe('finishSubmission', () => {
    let id, initialManuscript

    beforeAll(() =>
      jest
        .spyOn(FileManager, 'getContent')
        .mockImplementation(() => 'A real PDF'))

    afterAll(() => FileManager.getContent.mockRestore())

    beforeEach(async () => {
      jest.clearAllMocks()

      initialManuscript = Manuscript.new({ createdBy: userId })
      initialManuscript.files = [
        {
          url: 'fake-path.pdf',
          filename: 'FakeManuscript.pdf',
          type: 'MANUSCRIPT_SOURCE',
        },
      ]

      const manuscript = await Manuscript.save(initialManuscript)
      id = manuscript.id
    })

    it('stores data with new status', async () => {
      const returnedManuscript = await Mutation.finishSubmission(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId },
      )

      expect(returnedManuscript.status).toBe(
        Manuscript.statuses.MECA_EXPORT_PENDING,
      )

      const storedManuscript = await Manuscript.find(id, userId)

      expect(storedManuscript).toMatchObject({
        ...expectedManuscript,
        status: expect.stringMatching(/^MECA_EXPORT_(SUCCEEDED|PENDING)/),
      })
    })

    it('calls meca export with correct arguments', async () => {
      const ip = '1.2.3.4'
      await Mutation.finishSubmission(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId, ip },
      )

      expect(mecaExport).toHaveBeenCalled()
      const [
        actualManuscript,
        actualContent,
        actualIp,
      ] = mecaExport.mock.calls[0]
      expect(actualManuscript.id).toBe(id)
      expect(actualContent).toBe('A real PDF')
      expect(actualIp).toBe(ip)
    })

    it('removes blank optional reviewer rows', async () => {
      const manuscript = lodash.cloneDeep(manuscriptInput)
      manuscript.id = id
      manuscript.suggestedReviewers = [
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: '', email: '' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
        { name: '', email: '' },
      ]
      await Mutation.finishSubmission(
        {},
        { data: manuscript },
        { user: profileId },
      )

      const storedManuscript = await Manuscript.find(id, userId)
      const team = storedManuscript.teams.find(
        t => t.role === 'suggestedReviewer',
      )
      expect(team.teamMembers.map(member => member.meta)).toEqual([
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
      ])
    })

    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new({ createdBy: userId })
      const manuscript = await Manuscript.save(blankManuscript)
      await expect(
        Mutation.finishSubmission(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      await expect(
        Mutation.finishSubmission(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow()
    })

    it('fails when manuscript has bad data types', async () => {
      const badManuscript = lodash.cloneDeep(manuscriptInput)
      lodash.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      await expect(
        Mutation.finishSubmission(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow(
        '"title" is not allowed. "manuscriptType" is not allowed',
      )
    })

    it('sends email and updates status when export fails', async () => {
      jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
      mecaExport.mockImplementationOnce(() =>
        Promise.reject(new Error('Broked')),
      )

      const manuscript = lodash.cloneDeep(manuscriptInput)
      manuscript.id = id
      await Mutation.finishSubmission(
        {},
        { data: manuscript },
        { user: profileId },
      )

      // resolver doesn't wait for export to complete so just keep retrying for a second
      for (let i = 0; i < 100 && mailer.getMails().length === 0; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      expect(mailer.getMails()).toMatchObject([
        {
          to: 'test@example.com',
          subject: 'MECA export failed',
        },
      ])
      expect(logger.error).toHaveBeenCalled()
      const updatedManuscript = await Manuscript.find(manuscript.id, userId)
      expect(updatedManuscript.status).toBe(
        Manuscript.statuses.MECA_EXPORT_FAILED,
      )
    })
  })

  describe('uploadManuscript', () => {
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

    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const manuscript = await Manuscript.save(blankManuscript)

      await expect(
        Mutation.uploadManuscript(
          {},
          { id: manuscript.id },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('saves manuscript to S3', async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const { id } = await Manuscript.save(blankManuscript)
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

      const pdfBinary = await FileManager.getContent(
        Manuscript.getSource(manuscript),
      )
      expect(pdfBinary.toString().substr(0, 6)).toEqual('%PDF-1')
    })

    it('sets empty title if ScienceBeam fails', async () => {
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
      replaySetup('error')
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const { id } = await Manuscript.save(blankManuscript)
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
        meta: { title: '' },
        files: [{ filename: 'manuscript.pdf' }],
      })
      expect(logger.warn).toHaveBeenCalled()
    })

    it('extracts title from PDF', async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const { id } = await Manuscript.save(blankManuscript)
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
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const { id } = await Manuscript.save(blankManuscript)

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
  })

  describe('deleteManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const manuscript = await Manuscript.save(blankManuscript)

      await expect(
        Mutation.deleteManuscript(
          {},
          { id: manuscript.id },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('removes manuscript from database', async () => {
      const blankManuscript = Manuscript.new()
      blankManuscript.createdBy = userId
      const manuscript = await Manuscript.save(blankManuscript)
      await Mutation.deleteManuscript(
        {},
        { id: manuscript.id },
        { user: profileId },
      )

      const manuscripts = await Manuscript.all(userId)
      expect(manuscripts).toEqual([])
    })
  })
})
