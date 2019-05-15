class Submission {
  constructor({ models: { Manuscript, File }, services: { Storage } }) {
    this.ManuscriptModel = Manuscript
    this.FileModel = File
    this.Storage = Storage
  }

  async initialize(manuscriptId, userId) {
    this.manuscript = await this.ManuscriptModel.find(manuscriptId, userId)
    this.files = await this.FileModel.findByManuscriptId(manuscriptId)
    return this
  }

  _getFilesWithDownloadLink() {
    return this.files
      ? this.files.map(file => ({
          ...file.toJSON(),
          downloadLink: this.Storage.getDownloadLink(file),
        }))
      : []
  }

  toJSON() {
    return {
      ...this.manuscript.toJSON(),
      files: this._getFilesWithDownloadLink(),
    }
  }
}

module.exports = Submission
