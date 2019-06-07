const { intersection } = require('lodash')
const { mergeObjects } = require('../utils')

class Submission {
  constructor({
    models: { Manuscript, File, Team, SemanticExtraction },
    services: { Storage },
  }) {
    this.ManuscriptModel = Manuscript
    this.FileModel = File
    this.TeamModel = Team
    this.SemanticExtractionModel = SemanticExtraction
    this.Storage = Storage

    if (this.ManuscriptModel == null) {
      throw new Error('Cannot construct Submission without a Manuscript model')
    }
    if (this.FileModel == null) {
      throw new Error('Cannot construct Submission without a File model')
    }
    if (this.TeamModel == null) {
      throw new Error('Cannot construct Submission without a Team model')
    }
    if (this.SemanticExtractionModel == null) {
      throw new Error(
        'Cannot construct Submission without a SemanticExtraction model',
      )
    }
  }

  async initialize(manuscriptId, userId) {
    this.manuscript = await this.ManuscriptModel.find(
      manuscriptId,
      userId,
      '[teams]',
    )
    this.files = await this.FileModel.findByManuscriptId(manuscriptId)
    this.teams = await this.TeamModel.findByManuscriptId(manuscriptId)
    this.suggestions = await this.SemanticExtractionModel.findByManuscriptId(
      manuscriptId,
    )

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

  async _saveTeams() {
    this.manuscript.teams = this.teams

    await this.manuscript.save()

    this.teams = this.manuscript.teams
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

  async updateManuscript(manuscriptData) {
    if (this.manuscript.status !== this.ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${this.manuscript.status}`,
      )
    }

    this.manuscript = mergeObjects(this.manuscript, manuscriptData)

    return this.manuscript.save()
  }

  async updateAuthorTeam(author) {
    this._addTeam({
      role: 'author',
      teamMembers: [
        {
          alias: author,
          meta: { corresponding: true },
        },
      ],
    })

    return this._saveTeams()
  }

  async updateEditorTeams(editors) {
    const {
      suggestedSeniorEditors = [],
      opposedSeniorEditors = [],
      suggestedReviewingEditors = [],
      opposedReviewingEditors = [],
    } = editors

    if (
      intersection(suggestedSeniorEditors, opposedSeniorEditors).length > 0 ||
      intersection(suggestedReviewingEditors, opposedReviewingEditors).length >
        0
    ) {
      throw new Error(`Same editor has been suggested and opposed`)
    }

    const shapeEditor = id => ({ meta: { elifePersonId: id } })

    this._addTeam({
      role: 'suggestedSeniorEditor',
      teamMembers: suggestedSeniorEditors.map(shapeEditor),
    })

    this._addTeam({
      role: 'opposedSeniorEditor',
      teamMembers: opposedSeniorEditors.map(shapeEditor),
    })

    this._addTeam({
      role: 'suggestedReviewingEditor',
      teamMembers: suggestedReviewingEditors.map(shapeEditor),
    })

    this._addTeam({
      role: 'opposedReviewingEditor',
      teamMembers: opposedReviewingEditors.map(shapeEditor),
    })

    return this._saveTeams()
  }

  async updateReviewerTeams(reviewers) {
    const { suggestedReviewers = [], opposedReviewers = [] } = reviewers

    const shapeReviewer = meta => ({ meta })

    this._addTeam({
      role: 'suggestedReviewer',
      teamMembers: suggestedReviewers.map(shapeReviewer),
    })

    this._addTeam({
      role: 'opposedReviewer',
      teamMembers: opposedReviewers.map(shapeReviewer),
    })

    return this._saveTeams()
  }
}

module.exports = Submission
