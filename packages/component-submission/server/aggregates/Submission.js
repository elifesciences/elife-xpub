const { mergeObjects, hasMatchingEditors } = require('../utils')

class Submission {
  constructor({ models: { Manuscript, File, Team }, services: { Storage } }) {
    this.ManuscriptModel = Manuscript
    this.FileModel = File
    this.TeamModel = Team
    this.Storage = Storage
  }

  async initialize(manuscriptId, userId) {
    this.manuscript = await this.ManuscriptModel.find(manuscriptId, userId)
    this.files = await this.FileModel.findByManuscriptId(manuscriptId)
    this.teams = await this.TeamModel.findByManuscriptId(manuscriptId)

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

  _addTeam(team) {
    const index = this.teams.findIndex(t => t.role === team.role)

    // make sure object type is set for teams
    if (index >= 0) {
      Object.assign(this.teams[index], { objectType: 'manuscript' }, team)
    } else {
      this.teams.push(Object.assign({ objectType: 'manuscript' }, team))
    }
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
      teams: this.teams.map(team => team.toJSON()),
    }
  }

  updateManuscript(manuscriptData) {
    if (this.manuscript.status === this.ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${this.manuscript.status}`,
      )
    }

    this.manuscript = mergeObjects(this.manuscript, manuscriptData)
    this.manuscript.save()
  }

  updateAuthorTeam(authorTeam) {
    this._addTeam(authorTeam)
  }

  updateEditorTeams(editorTeams) {
    const {
      suggestedSeniorEditor = {},
      opposedSeniorEditor = {},
      suggestedReviewingEditor = {},
      opposedReviewingEditor = {},
    } = editorTeams

    if (
      hasMatchingEditors(suggestedSeniorEditor, opposedSeniorEditor) ||
      hasMatchingEditors(suggestedReviewingEditor, opposedReviewingEditor)
    ) {
      throw new Error(`Same editor has been suggested and opposed`)
    }
    if (suggestedSeniorEditor !== {}) {
      this._addTeam(suggestedSeniorEditor)
    }
    if (opposedSeniorEditor !== {}) {
      this._addTeam(opposedSeniorEditor)
    }
    if (suggestedReviewingEditor !== {}) {
      this._addTeam(suggestedReviewingEditor)
    }
    if (opposedReviewingEditor !== {}) {
      this._addTeam(opposedReviewingEditor)
    }
  }

  updateReviewerTeams(reviewerTeams) {
    reviewerTeams.forEach(team => this._addTeam(team))
  }
}

module.exports = Submission
