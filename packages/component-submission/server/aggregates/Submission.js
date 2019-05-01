class Submission {
  constructor({ models: { Manuscript, File }, services: { Storage } }) {
    this.ManuscriptModel = Manuscript
    this.FileModel = File
    this.Storage = Storage
  }

  async initialize(manuscriptId, userId) {
    this.manuscript = await this.ManuscriptModel.find(manuscriptId, userId)
    this.files = await this.FileModel.findByManuscriptId(manuscriptId)
    console.log(this.manuscript, this.files)
    return this
  }

  getFilesWithDownloadLink() {
    return this.files
      ? this.files.map(file => ({
          ...file.toJSON(),
          downloadLink: this.Storage.getDownloadLink(file),
        }))
      : []
  }

  toJSON() {
    const processedFiles = this.getFilesWithDownloadLink()
    return {
      ...this.manuscript.toJSON(),
      files: processedFiles.map(file => file.toJSON()),
    }
  }
}

module.exports = Submission
