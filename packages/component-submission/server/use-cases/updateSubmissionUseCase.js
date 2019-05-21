const { pick } = require('lodash')

function getManuscriptData(data) {
  return pick(data, [
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

function getEditorTeams(data) {
  return pick(data, [
    'suggestedSeniorEditor',
    'opposedSeniorEditor',
    'suggestedReviewingEditor',
    'opposedReviewingEditor',
  ])
}

function getReviewerTeams(data) {
  return pick(data, ['suggestedReviewer', 'opposedReviewer'])
}

const initialize = ({ submission }) => ({
  execute: async (manuscriptId, userId, data) => {
    const manuscriptData = getManuscriptData(data)
    const editorTeams = getEditorTeams(data)
    const reviewerTeams = getReviewerTeams(data)

    await submission.initialize(manuscriptId, userId)

    await submission.updateManuscript(manuscriptData)
    await submission.updateAuthorTeam(data.author)
    await submission.updateEditorTeams(editorTeams)
    await submission.updateReviewerTeams(reviewerTeams)
  },
})

module.exports = {
  initialize,
}
