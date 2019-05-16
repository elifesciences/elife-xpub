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

  filesAreStored() {
    if (!this.files) return true

    const FILE_STATUSES = [
      {
        uploadStatuses: ['STORED', 'CANCELLED'],
        isReady: true,
      },
      {
        uploadStatuses: ['UPLOADED', 'CREATED'],
        isReady: false,
      },
    ]
    return this.files
      .map(
        file =>
          FILE_STATUSES.find(f => f.uploadStatuses.includes(file.status))
            .isReady,
      )
      .every(status => status)
  }

  toJSON() {
    return {
      ...this.manuscript.toJSON(),
      fileStatus: this.filesAreStored() ? 'READY' : 'CHANGING',
      files: this._getFilesWithDownloadLink(),
    }
  }
}

module.exports = Submission
