class UploadPredictor {
  constructor(fileSize) {
    // Predict upload time -
    // The analysis was done on #839
    // NOTE: This is not effective locally as S3 becomes significant and
    // file upload less so. Whereas in production S3 happens within AWS and
    // the file upload is the most significant factor.
    this.constant = 5
    this.gradient = 4.67e-6
    this.fileSize = fileSize
    this.startTime = 0
  }

  static round(n) {
    return Math.round(100 * n) / 100
  }

  getPredictedTime() {
    const t = UploadPredictor.round(
      this.constant + this.gradient * this.fileSize,
    )
    return t
  }

  getConstant() {
    return this.constant
  }

  startSeconds(time) {
    this.startTime = time
  }

  updateSeconds(time, currentSize) {
    const diffTime = time - this.startTime
    this.gradient = diffTime / currentSize
  }
}

module.exports = UploadPredictor
