exports.userData = {
  identities: [
    {
      type: 'elife',
      identifier: 'ewwboc7m',
      email: 'test@example.com',
      meta: {
        orcid: '0000-0003-3146-0256',
      },
    },
  ],
}

exports.badUserData = {
  identities: [
    {
      type: 'elife',
      identifier: 'badbadnotgood',
      email: 'bad@example.com',
      meta: {
        orcid: '0000-0001-0000-0000',
      },
    },
  ],
}

exports.manuscriptInput = {
  author: {
    firstName: 'Firstname',
    lastName: 'Lastname',
    email: 'mymail@mail.com',
    aff: 'Institution Inc',
  },
  cosubmission: ['More interesting observations on chickens'],
  coverLetter: 'my cover letter',
  disclosureConsent: true,
  meta: {
    articleType: 'research-article',
    subjects: ['cancer-biology'],
    title: 'My manuscript',
  },
  opposedReviewers: [{ name: 'Reviewer 4', email: 'reviewer4@mail.com' }],
  opposedReviewersReason: 'Reviewer 4 is my wife',
  opposedReviewingEditors: ['kl12'],
  opposedReviewingEditorsReason: 'I do not like them, Sam I am',
  opposedSeniorEditors: ['ij90'],
  opposedSeniorEditorsReason: 'I do not like green eggs and ham',
  previouslyDiscussed: 'Discussed this with bob',
  previouslySubmitted: ['An important finding about ants'],
  submitterSignature: 'Sneha Berry',
  suggestedReviewers: [
    { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
    { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
    { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
  ],
  suggestedReviewingEditors: ['ef56', 'gh78'],
  suggestedSeniorEditors: ['ab12', 'cd34'],
  suggestionsConflict: false,
}

exports.expectedManuscript = {
  cosubmission: ['More interesting observations on chickens'],
  coverLetter: 'my cover letter',
  decision: null,
  disclosureConsent: true,
  lastStepVisited: null,
  journalId: null,
  meta: {
    articleType: 'research-article',
    subjects: ['cancer-biology'],
    title: 'My manuscript',
  },
  opposedReviewersReason: 'Reviewer 4 is my wife',
  opposedReviewingEditorsReason: 'I do not like them, Sam I am',
  opposedSeniorEditorsReason: 'I do not like green eggs and ham',
  previouslyDiscussed: 'Discussed this with bob',
  previouslySubmitted: ['An important finding about ants'],
  previousVersion: null,
  relatedManuscripts: null,
  qcIssues: null,
  status: 'INITIAL',
  submitterSignature: 'Sneha Berry',
  suggestionsConflict: false,
}
