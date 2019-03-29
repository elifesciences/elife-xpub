const UploadPredictor = require('./upload-predictor')

describe('UploadPredictor', () => {
  it('initial prediction is correct', () => {
    const checkTimeForSize = (time, size) => {
      const predictor = new UploadPredictor(size)
      expect(predictor.getPredictedTime()).toBe(time)
    }

    checkTimeForSize(5.0, 1e3)
    checkTimeForSize(9.67, 1e6)
    checkTimeForSize(51.7, 10e6)
  })

  it('prediction does not change from initial if correct', () => {
    const size = 1e6
    const predictor = new UploadPredictor(size)
    const initialPrediction = predictor.getPredictedTime()
    predictor.start(0)
    predictor.update(initialPrediction - predictor.getConstant(), size)
    expect(predictor.getPredictedTime()).toBe(initialPrediction)
  })

  it('prediction remains constant for constant updates', () => {
    const size = 1e6
    const predictor = new UploadPredictor(size)
    const initialPrediction = predictor.getPredictedTime()
    predictor.start(0)
    const steps = 10
    for (let i = 1; i <= steps; i += 1) {
      const uploadedSize = (size * i) / steps
      const time = ((initialPrediction - predictor.getConstant()) * i) / steps
      predictor.update(time, uploadedSize)
      expect(predictor.getPredictedTime()).toBe(initialPrediction)
    }
  })

  const testUploadFactor = factor => {
    const size = 1e6
    let initialPrediction = 0
    let predictor = null

    const setup = () => {
      predictor = new UploadPredictor(size)
      initialPrediction = predictor.getPredictedTime()
      predictor.start(0)
      return predictor
    }

    const simulateFactor = () => {
      const c = predictor.getConstant()
      // simulate the new factor over a third
      const uploadedSize = (size * (1 / factor)) / 3
      const time = (initialPrediction - c) / 3
      predictor.update(time, uploadedSize)
      // return expected time
      return c + factor * (initialPrediction - c)
    }

    // Twice as slow
    predictor = setup()
    const expected = simulateFactor(factor)
    expect(predictor.getPredictedTime()).toBe(UploadPredictor.round(expected))
  }

  it('prediction changes when n-times slower', () => {
    testUploadFactor(20)
    testUploadFactor(2)
    testUploadFactor(0.5)
    testUploadFactor(0.05)
  })
})
