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
  coverLetter: `
<p><strong>How will your work make others in the field think differently and move the field forward?</strong></p>
<p></p>
<p><strong>How does your work relate to the current literature on the topic?</strong></p>
<p></p>
<p><strong>Who do you consider to be the most relevant audience for this work?</strong></p>
<p></p>
<p><strong>Have you made clear in the letter what the work has and has not achieved?</strong></p>
<p></p>
`,
  status: 'INITIAL',
  previouslyDiscussed: null,
  previouslySubmitted: [],
  cosubmission: [],
  submitterSignature: '',
  disclosureConsent: false,
  teams: [],
  audits: []
}

module.exports = emptyManuscript
