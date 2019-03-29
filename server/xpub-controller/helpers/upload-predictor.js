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
    const t = UploadPredictor.round(
      this.constant + this.gradient * this.fileSize,
    )
    console.log(`::::::::: ${t}`)
    return t
  }

  getConstant() {
    return this.constant
  }

  startSeconds(time) {
    this.startTime = time
  }

  updateSeconds(time, currentSize) {
    const old = this.gradient
    const diffTime = time - this.startTime
    this.gradient = diffTime / currentSize
    console.log(
      currentSize / this.fileSize,
      diffTime,
      ' | ',
      old,
      '->',
      this.gradient,
    )
  }
}

module.exports = UploadPredictor
