const FilesHelper = require('./files')

const data = [
  {
    now: 1550498450221,
    startDate: 1550498450014,
    predictedTime: 5.04049824,
    progress: 4,
  },
  {
    now: 1550498450424,
    startDate: 1550498450014,
    predictedTime: 5.04049824,
    progress: 8,
  },
  {
    now: 1550498450629,
    startDate: 1550498450014,
    predictedTime: 5.04049824,
    progress: 12,
  },
]

const mockTimes = currentTimeData => {
  const mockDate = new Date(currentTimeData.now)
  global.Date = jest.fn(() => mockDate)
  global.Date.now = () => mockDate
}

describe('FilesHelper Test', () => {
  describe('publishPredictedProgress', () => {
    it('ensure the progress calculation is correct', () => {
      const pubsubMock = expectedProgress => ({
        publish: (param1, param2) => {
          expect(param1).toBe(
            'ON_UPLOAD_PROGRESS.4512fc2f-85bc-4032-97da-c63f8fefec61',
          )
          expect(param2.manuscriptUploadProgress).toEqual(expectedProgress)
        },
      })

      // test over differen times to observe the progress is the correct one.
      // | now            |   startdate      |  predictedTime   |   progress
      // | 1550498450221  |  1550498450014   | 5.04049824       |   4
      // | 1550498450424  |  1550498450014   | 5.04049824       |   8
      // | 1550498450629  |  1550498450014   | 5.04049824       |   12

      data.forEach(currentTimeData => {
        const originalDate = Date
        mockTimes(currentTimeData)
        const progressFunc = FilesHelper.publishPredictedProgress(
          pubsubMock(currentTimeData.progress),
          'ON_UPLOAD_PROGRESS',
          currentTimeData.startDate,
          currentTimeData.predictedTime,
          '4512fc2f-85bc-4032-97da-c63f8fefec61',
        )
        progressFunc()
        global.Date = originalDate
      })
    })
  })
})
