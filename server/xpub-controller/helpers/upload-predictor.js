class UploadPredictor {
  constructor(fileSize) {
    // Predict upload time - The analysis was done on #839
    this.predictedTime = 5 + 4.67e-6 * fileSize
    this.fileSize = fileSize
  }

  getPredictedTime() {
    return this.predictedTime
  }
}

module.exports = UploadPredictor
