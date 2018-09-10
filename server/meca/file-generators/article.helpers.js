const editorFormatter = (member, affiliations, editorsById) => {
  const editor = editorsById[member.meta.elifePersonId]
  return {
    // TODO once we can get the data from the API
    name: {
      surname: editor.name,
      'given-names': '',
    },
    email: '',
    xref: {
      '@ref-type': 'aff',
      '@rid': `aff${affiliations.indexOf(editor.aff)}`,
    },
  }
}

const contribStructure = {
  authors: {
    keys: ['author'],
    formatter: (member, affiliations) => ({
      '@corresp': member.meta.corresponding ? 'yes' : 'no',
      name: {
        surname: member.alias.lastName,
        'given-names': member.alias.firstName,
      },
      email: member.alias.email,
      xref: {
        '@ref-type': 'aff',
        '@rid': `aff${affiliations.indexOf(member.alias.aff)}`,
      },
    }),
  },
  'potential-senior-editors': {
    keys: ['suggestedSeniorEditor', 'opposedSeniorEditor'],
    formatter: editorFormatter,
  },
  'potential-reviewing-editors': {
    keys: ['suggestedReviewingEditor', 'opposedReviewingEditor'],
    formatter: editorFormatter,
  },
  'potential-reviewers': {
    keys: ['suggestedReviewer', 'opposedReviewer'],
    formatter: member => ({
      name: {
        // TODO split name?
        surname: member.meta.name,
        'given-names': '',
      },
      email: member.meta.email,
    }),
  },
}

const articleTypeMap = {
  'research-article': 5,
  'short-report': 13,
  'tools-resources': 19,
  'scientific-correspondence': 20,
  feature: 23,
}

const journalMeta = {
  'journal-id': [
    { '@journal-id-type': 'pmc' },
    { '@journal-id-type': 'publisher' },
  ],
  issn: {},
  publisher: {
    'publisher-name': {},
  },
}

module.exports = { contribStructure, articleTypeMap, journalMeta }
