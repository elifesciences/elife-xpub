class UploadPredictor {
  constructor(fileSize) {
    // Predict upload time - The analysis was done on #839
    this.constant = 5
    this.gradient = 4.67e-6
    this.fileSize = fileSize
    this.startTime = 0
  }

  static round(n) {
    return Math.round(100 * n) / 100
  }

  getPredictedTime() {
    return UploadPredictor.round(this.constant + this.gradient * this.fileSize)
  }

  getConstant() {
    return this.constant
  }

  start(time) {
    this.startTime = time
  }

  update(time, currentSize) {
    const diffTime = time - this.startTime
    this.gradient = diffTime / currentSize
  }
}

module.exports = UploadPredictor
