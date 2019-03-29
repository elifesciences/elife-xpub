class UploadPredictor {
  constructor(fileSize) {
    // Predict upload time - The analysis was done on #839
    this.predictedTime = 5 + 4.67e-6 * fileSize
    this.fileSize = fileSize
    this.start()
  }

  getPredictedTime() {
    return this.predictedTime
  }

  start() {
    this.startTime = Date.now()
    this.lastTime = Date.now()
  }

  update(time, newSize) {
    const oldPrediction = this.predictedTime
    const newPrediction = oldPrediction

    return newPrediction
  }
}

module.exports = UploadPredictor
