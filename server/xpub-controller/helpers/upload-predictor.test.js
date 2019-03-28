const UploadPredictor = require('./upload-predictor')

describe('UploadPredictor', () => {
  it('initial prediction is correct', () => {
    const checkTimeForSize = (time, size) => {
      const predictor = new UploadPredictor(size)
      expect(predictor.getPredictedTime()).toBe(time)
    }

    checkTimeForSize(5.00467, 1e3)
    checkTimeForSize(9.67, 1e6)
    checkTimeForSize(51.7, 10e6)
  })
})
