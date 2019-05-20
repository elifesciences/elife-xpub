const { intersection } = require('lodash')
const { mergeObjects } = require('../utils')

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

  updateAuthorTeam(author) {
    this._addTeam({
      role: 'author',
      teamMembers: [
        {
          alias: author,
          meta: { corresponding: true },
        },
      ],
    })
  }

  updateEditorTeams(editors) {
    const {
      suggestedSeniorEditor = [],
      opposedSeniorEditor = [],
      suggestedReviewingEditor = [],
      opposedReviewingEditor = [],
    } = editors

    if (
      intersection(suggestedSeniorEditor, opposedSeniorEditor).length > 0 ||
      intersection(suggestedReviewingEditor, opposedReviewingEditor).length > 0
    ) {
      throw new Error(`Same editor has been suggested and opposed`)
    }

    const shapeEditor = id => ({ meta: { elifePersonId: id } })

    this._addTeam({
      role: 'suggestedSeniorEditors',
      teamMembers: suggestedSeniorEditor.map(shapeEditor),
    })

    this._addTeam({
      role: 'opposedSeniorEditors',
      teamMembers: opposedSeniorEditor.map(shapeEditor),
    })

    this._addTeam({
      role: 'suggestedReviewingEditors',
      teamMembers: suggestedReviewingEditor.map(shapeEditor),
    })

    this._addTeam({
      role: 'opposedReviewingEditors',
      teamMembers: opposedReviewingEditor.map(shapeEditor),
    })
  }

  updateReviewerTeams(reviewers) {
    const { suggestedReviewer = [], opposedReviewer = [] } = reviewers

    const shapeReviewer = meta => ({ meta })

    this._addTeam({
      role: 'suggestedReviewers',
      teamMembers: suggestedReviewer.map(shapeReviewer),
    })

    this._addTeam({
      role: 'opposedReviewers',
      teamMembers: opposedReviewer.map(shapeReviewer),
    })
  }
}

module.exports = Submission
