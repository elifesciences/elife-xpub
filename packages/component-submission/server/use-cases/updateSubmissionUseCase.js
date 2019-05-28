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
    'suggestedSeniorEditors',
    'opposedSeniorEditors',
    'suggestedReviewingEditors',
    'opposedReviewingEditors',
  ])
}

function getReviewerTeams(data) {
  return pick(data, ['suggestedReviewers', 'opposedReviewers'])
}

const initialize = ({ submission, logger }) => ({
  execute: async (manuscriptId, userId, data) => {
    const manuscriptData = getManuscriptData(data)
    const editorTeams = getEditorTeams(data)
    const reviewerTeams = getReviewerTeams(data)

    try {
      await submission.initialize(manuscriptId, userId)

      await submission.updateManuscript(manuscriptData)
      await submission.updateAuthorTeam(data.author)
      await submission.updateEditorTeams(editorTeams)
      await submission.updateReviewerTeams(reviewerTeams)
    } catch (error) {
      const expected = 'Data Integrity Error'
      if (error.message.startsWith(expected)) {
        logger.error(`Expected a ${expected}, ${error.message}`)
      } else {
        logger.error(error)
        // not an error we were expecting.
        throw error
      }
    }

    return submission.toJSON()
  },
})

module.exports = {
  initialize,
}
