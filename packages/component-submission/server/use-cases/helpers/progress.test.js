const uuid = require('uuid')
const FilesHelper = require('./files')

describe('FileProgress', () => {
  const manuscriptId = uuid()
  const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'
  const predictor = {
    getPredictedTime: () => 1,
  }

  describe('startFileProgress', () => {
    const maxTime = 2000
    const pubsubMock = {
      calls: [],
      publish: (msg, obj) => pubsubMock.calls.push({ msg, obj }),
    }
    const waitforUpdates = async number => {
      const interval = 10
      let i = -1
      // limit the max wait to 2 seconds
      for (
        i = 0;
        i < maxTime / interval && pubsubMock.calls.length < number;
        i += 1
      ) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, interval))
      }
      return i * interval
    }

    it('starts and ends file progress ok', async () => {
      const startedTime = Date.now()
      const progress = FilesHelper.startFileProgress(
        pubsubMock,
        ON_UPLOAD_PROGRESS,
        startedTime,
        predictor,
        manuscriptId,
        333,
      )

      // Waiting for 4 updates of 333 ms should result in the predicted
      // time of 1 second
      const waitTime = await waitforUpdates(4)
      expect(pubsubMock.calls).toHaveLength(4)

      FilesHelper.endFileProgress(
        pubsubMock,
        ON_UPLOAD_PROGRESS,
        100,
        manuscriptId,
      )
      // this ensures everything is closed - this is tested for elsewhere
      clearInterval(progress)

      expect(pubsubMock.calls).toHaveLength(5)

      // finally make sure we have not timed out
      expect(waitTime).toBeLessThan(maxTime)
    })
  })

  describe('endFileProgress', () => {
    const pubsubMock = {
      publish: jest.fn(),
    }
    beforeEach(() => {
      jest.useFakeTimers()
    })
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
})
