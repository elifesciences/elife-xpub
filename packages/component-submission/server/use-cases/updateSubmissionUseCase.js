const lodash = require('lodash')

function getManuscriptData(data) {
  return lodash.pick(data, [
    'meta',
    'coverLetter',
    'opposedSeniorEditorsReason',
    'opposedReviewingEditorsReason',
    'previouslyDiscussed',
    'previouslySubmitted',
    'cosubmission',
    'opposedReviewersReason',
    'submitterSignature',
    'disclosureConsent',
  ])
}

function getAuthorTeam(data) {
  return {
    role: 'author',
    teamMembers: [{ alias: data.author, meta: { corresponding: true } }],
  }
}

function getEditorTeams(data) {
  const editorSuggestionRoles = [
    'suggestedSeniorEditor',
    'opposedSeniorEditor',
    'suggestedReviewingEditor',
    'opposedReviewingEditor',
  ]

  return editorSuggestionRoles.map(role => {
    const key = `${role}s`
    const suggestedEditorIds = data[key] || []
    const teamMembers = suggestedEditorIds.map(id => ({
      meta: { elifePersonId: id },
    }))
    return { role, teamMembers }
  })
}

function getReviewerTeams(data) {
  const reviewerSuggestionRoles = ['suggestedReviewer', 'opposedReviewer']

  return reviewerSuggestionRoles.map(role => {
    const key = `${role}s`
    const suggestedReviewerAliases = data[key] || []
    const teamMembers = suggestedReviewerAliases.map(meta => ({ meta }))
    return { role, teamMembers }
  })
}

const initialize = ({ submission }) => ({
  execute: async (manuscriptId, userId, data) => {
    const manuscriptData = getManuscriptData(data)
    const authorTeam = getAuthorTeam(data)
    const editorTeams = getEditorTeams(data)
    const reviewerTeams = getReviewerTeams(data)

    await submission.initialize(manuscriptId, userId)

    submission.updateManuscript(manuscriptData)
    submission.updateAuthorTeam(authorTeam)
    submission.updateEditorTeams(editorTeams)
    submission.updatedReviewerTeams(reviewerTeams)
  },
})

module.exports = {
  initialize,
}
