const lodash = require('lodash')
const emptyManuscript = require('./helpers/empty')
const dataAccess = require('./data-access')

const mergeObjects = (...inputs) =>
  lodash.mergeWith(
    ...inputs,
    // always replace arrays instead of merging
    (objValue, srcValue) => {
      if (lodash.isArray(srcValue)) {
        return srcValue
      }
      return undefined
    },
  )

const Manuscript = {
  MAX_SUGGESTED_REVIEWERS: 6,
  MIN_SUGGESTED_REVIEWERS: 3,

  find: dataAccess.selectById,
  all: dataAccess.selectAll,
  findByStatus: dataAccess.selectByStatus,
  delete: dataAccess.delete,

  new: () => lodash.cloneDeep(emptyManuscript),

  save: async manuscript => {
    if (manuscript.id) {
      await dataAccess.update(manuscript)
      return manuscript
    }

    const id = await dataAccess.insert(manuscript)
    return { ...manuscript, id }
  },

  applyInput: (originalManuscript, input) => {
    const manuscript = mergeObjects(
      {},
      originalManuscript,
      lodash.pick(input, [
        'meta',
        'coverLetter',
        'opposedSeniorEditorsReason',
        'opposedReviewingEditorsReason',
        'previouslyDiscussed',
        'previouslySubmitted',
        'cosubmission',
        'opposedReviewers',
        'suggestionsConflict',
      ]),
    )

    // reshape suggested editors into teams
    const editorSuggestionRoles = [
      'suggestedSeniorEditor',
      'opposedSeniorEditor',
      'suggestedReviewingEditor',
      'opposedReviewingEditor',
    ]
    const editorSuggestionTeams = editorSuggestionRoles.map(role => {
      const key = `${role}s`
      const suggestedEditorIds = input[key] || []
      const teamMembers = suggestedEditorIds.map(id => ({
        meta: { elifePersonId: id },
      }))
      return { role, teamMembers }
    })
    manuscript.teams = manuscript.teams
      .filter(team => !editorSuggestionRoles.includes(team.role))
      .concat(editorSuggestionTeams)

    // reshape suggested reviewers into teams
    const reviewerSuggestionRoles = ['suggestedReviewer']
    const reviewerSuggestionTeams = reviewerSuggestionRoles.map(role => {
      const key = `${role}s`
      const suggestedReviewerAliases = input[key] || []
      const teamMembers = suggestedReviewerAliases.map(meta => ({ meta }))
      return { role, teamMembers }
    })
    manuscript.teams = manuscript.teams
      .filter(team => !reviewerSuggestionRoles.includes(team.role))
      .concat(reviewerSuggestionTeams)

    // move author into team
    manuscript.teams = manuscript.teams
      .filter(team => team.role !== 'author')
      .concat({
        role: 'author',
        teamMembers: [{ alias: input.author }],
      })

    return manuscript
  },

  removeOptionalBlankReviewers: manuscript => {
    const itemIsBlank = item => item.name + item.email === ''

    const filteredReviewers = manuscript.suggestedReviewers.filter(
      (item, index) =>
        index < Manuscript.MIN_SUGGESTED_REVIEWERS || !itemIsBlank(item),
    )

    return { ...manuscript, suggestedReviewers: filteredReviewers }
  },

  checkPermission: (manuscript, user) => {
    if (user !== manuscript.createdBy) {
      throw new Error('Manuscript not owned by user')
    }
  },
}

module.exports = Manuscript
