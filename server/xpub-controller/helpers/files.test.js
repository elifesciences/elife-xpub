const config = require('config')
const uuid = require('uuid')
const stream = require('stream')
const { createTables } = require('@pubsweet/db-manager')
const logger = require('@pubsweet/logger')
const {
  SemanticExtraction,
  Manuscript: ManuscriptModel,
} = require('@elifesciences/component-model')
const FilesHelper = require('./files')

const getFilesHelper = scienceBeamApi => new FilesHelper(config, scienceBeamApi)

describe('FilesHelper', () => {
  describe('validateFileSize', () => {
    const maxSize = config.get('fileUpload.maxSizeMB')
    const invalidFileSize = (maxSize + 1) * 1e6
    const validFileSize = (maxSize - 1) * 1e6

    const filesHelper = getFilesHelper()

    it('throws an error if the file size is larger than maximum size', () => {
      expect(() => filesHelper.validateFileSize(invalidFileSize)).toThrow(
        `File size shouldn't exceed ${maxSize}MB`,
      )
    })
    it('does not throw if the file size is less than MaxSize', () => {
      expect(() => filesHelper.validateFileSize(validFileSize)).not.toThrow()
    })
  })

  describe('getFileData', () => {
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

      const fileData = await FilesHelper.getFileData(filePromise, id)
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
      const uploadedSize = 110
      const bufferStream = new stream.PassThrough()
      bufferStream.end(Buffer.alloc(uploadedSize))
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
      await FilesHelper.uploadFileToServer(bufferStream, fileSize)
      expect(logger.warn).toHaveBeenCalledWith(
        'Reported file size for manuscript is different than the actual file size',
      )
    })
  })

  describe('extractFileTitle', () => {
    it('creates a semantic extraction entry when extracting the file title', async () => {
      const fileTitle = 'Mock File Title'
      const mockScienceBeamApi = { extractSemantics: () => fileTitle }
      const filesHelper = getFilesHelper(mockScienceBeamApi)
      const userId = uuid()
      await createTables(true)

      const { id } = await new ManuscriptModel({ createdBy: userId }).save()

      await filesHelper.extractFileTitle(null, null, null, id)

      const semanticExtractions = await SemanticExtraction.all()

      expect(semanticExtractions).toHaveLength(1)
      expect(semanticExtractions[0]).toMatchObject({
        manuscriptId: id,
        fieldName: 'title',
        value: fileTitle,
      })
    })
  })
})
