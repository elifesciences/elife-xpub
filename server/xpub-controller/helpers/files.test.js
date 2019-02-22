const config = require('config')
const uuid = require('uuid')
const fs = require('fs-extra')
const { createTables } = require('@pubsweet/db-manager')
const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const UserModel = require('@elifesciences/xpub-model').User
const stream = require('stream')
const mailer = require('@pubsweet/component-send-email')
const FilesHelper = require('./files')
const { Mutation } = require('../../xpub-server/entities/manuscript/resolvers')
const {
  userData,
} = require('../../xpub-server/entities/manuscript/resolvers/index.test.data')

const filesHelper = new FilesHelper(config)

describe('FilesHelper', () => {
  describe('validateFileSize', () => {
    const maxSize = config.get('fileUpload.maxSizeMB')
    const invalidFileSize = (maxSize + 1) * 1e6
    const validFileSize = (maxSize - 1) * 1e6

    it('throws an error if the file size is larger than maximum size', () => {
      expect(() => filesHelper.validateFileSize(invalidFileSize)).toThrow(
        `File size shouldn't exceed ${maxSize}MB`,
      )
    })
    it('does not throw if the file size is less than MaxSize', () => {
      expect(() => filesHelper.validateFileSize(validFileSize)).not.toThrow()
    })
  })

  describe('generateFileEntity', () => {
    it('returns the file stream and file entity', async () => {
      const userId = uuid()
      await createTables(true)
      const { id } = await new ManuscriptModel({ createdBy: userId }).save()
      const file = {
        stream: {},
        filename: 'filename',
        mimetype: 'mimetype',
      }
      const filePromise = Promise.resolve(file)

      const fileData = await FilesHelper.generateFileEntity(filePromise, id)
      expect(fileData.stream).toEqual(file.stream)
      expect(fileData.fileEntity).toMatchObject({
        manuscriptId: id,
        id: expect.any(String),
        url: `manuscripts/${id}`,
        type: 'MANUSCRIPT_SOURCE_PENDING',
      })
    })
  })

  describe('publishPredictedProgress', () => {
    const timeData = [
      {
        now: 1550498450221,
        startDate: 1550498450014,
        predictedTime: 5.04049824,
        expectedProgress: 4,
      },
      {
        now: 1550498450424,
        startDate: 1550498450014,
        predictedTime: 5.04049824,
        expectedProgress: 8,
      },
      {
        now: 1550498450629,
        startDate: 1550498450014,
        predictedTime: 5.04049824,
        expectedProgress: 12,
      },
    ]

    const mockTimes = currentTimeData => {
      const mockDate = new Date(currentTimeData.now)
      global.Date = jest.fn(() => mockDate)
      global.Date.now = () => mockDate
    }
    const pubsubMock = {
      publish: jest.fn(),
    }

    const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'
    const manuscriptId = '4512fc2f-85bc-4032-97da-c63f8fefec61'

    it('calculates the progress correctly', () => {
      // test over differen times to observe the progress is the correct one.
      // | now            |   startdate      |  predictedTime   |   expectedProgress
      // | 1550498450221  |  1550498450014   | 5.04049824       |   4
      // | 1550498450424  |  1550498450014   | 5.04049824       |   8
      // | 1550498450629  |  1550498450014   | 5.04049824       |   12

      timeData.forEach(currentTimeData => {
        const originalDate = Date
        mockTimes(currentTimeData)

        const publishPredictedProgress = FilesHelper.publishPredictedProgress(
          pubsubMock,
          ON_UPLOAD_PROGRESS,
          currentTimeData.startDate,
          currentTimeData.predictedTime,
          manuscriptId,
        )
        publishPredictedProgress()

        expect(pubsubMock.publish).toHaveBeenCalledWith(
          `${ON_UPLOAD_PROGRESS}.${manuscriptId}`,
          { manuscriptUploadProgress: currentTimeData.expectedProgress },
        )

        global.Date = originalDate
      })
    })

    it('is validated when correct parameters are passed', () => {
      const startedTime = new Date()
      const predictedTime = 3
      const progressFunc = FilesHelper.publishPredictedProgress(
        { publish: () => {} },
        ON_UPLOAD_PROGRESS,
        startedTime,
        predictedTime,
        manuscriptId,
      )
      expect(progressFunc).not.toThrow()
    })

    it('throws an error if called with wrong parameters', () => {
      const startedTime = new Date()
      const predictedTime = 0
      const progressFunc = () =>
        FilesHelper.publishPredictedProgress(
          {},
          ON_UPLOAD_PROGRESS,
          startedTime,
          predictedTime,
          manuscriptId,
        )
      expect(progressFunc).toThrowError(
        new Error('Invalid parameters to calculate the upload file progress.'),
      )
    })
  })

  describe('endFileProgress', () => {
    jest.useFakeTimers()
    const manuscriptId = uuid()
    const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'
    const pubsubMock = {
      publish: jest.fn(),
    }
    it('publishes progress as a 100 percent', () => {
      const progress = setInterval(() => {}, 10)

      FilesHelper.endFileProgress(
        pubsubMock,
        ON_UPLOAD_PROGRESS,
        progress,
        manuscriptId,
      )
      expect(pubsubMock.publish).toHaveBeenCalledWith(
        `${ON_UPLOAD_PROGRESS}.${manuscriptId}`,
        { manuscriptUploadProgress: 100 },
      )
    })

    it('clears the progress interval', () => {
      const progress = setInterval(() => {}, 10)

      FilesHelper.endFileProgress(
        pubsubMock,
        ON_UPLOAD_PROGRESS,
        progress,
        manuscriptId,
      )
      expect(clearInterval).toHaveBeenCalledWith(progress)
    })
  })
  describe('uploadFilesToServer', () => {
    it('warns if the uploaded size is not the same as the fileSize', async () => {
      const fileSize = 100
      const wrongFileSize = 110
      const bufferStream = new stream.PassThrough()
      bufferStream.end(Buffer.alloc(wrongFileSize))
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
      await FilesHelper.uploadFileToServer(bufferStream, fileSize)
      expect(logger.warn).toHaveBeenCalledWith(
        'Reported file size for manuscript is different than the actual file size',
      )
    })
  })
  describe('extractFileTitle', () => {
    it('extracts title from PDF', async () => {
      await createTables(true)
      const [user] = await Promise.all([new UserModel(userData).save()])
      const userId = user.id
      const profileId = userData.identities[0].identifier
      mailer.clearMails()
      const blankManuscript = new ManuscriptModel({ createdBy: userId })
      const { id } = await blankManuscript.save()
      const file = {
        filename: 'manuscript.pdf',
        stream: fs.createReadStream(
          `${__dirname}/../../../test/fixtures/dummy-manuscript-2.pdf`,
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
  })
})
