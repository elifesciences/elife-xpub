/**
 * this should be kept in sync with the schema
 */
const emptyManuscript = {
  meta: {
    title: '',
    articleType: '',
    subjects: [],
  },
  opposedSeniorEditorsReason: '',
  opposedReviewingEditorsReason: '',
  opposedReviewersReason: '',
  files: [],
  coverLetter: '',
  status: 'INITIAL',
  previouslyDiscussed: null,
  previouslySubmitted: [],
  cosubmission: [],
  submitterSignature: '',
  disclosureConsent: false,
  teams: [],
}

module.exports = emptyManuscript
