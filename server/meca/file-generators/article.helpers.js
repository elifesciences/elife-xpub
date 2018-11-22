const editorFormatter = (member, affiliations, editorsById) => {
  const editor = editorsById[member.meta.elifePersonId]
  return {
    name: {
      surname: editor.surname,
      'given-names': editor.firstname,
    },
    email: editor.email,
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
  potential_senior_editors: {
    keys: ['suggestedSeniorEditor', 'opposedSeniorEditor'],
    formatter: editorFormatter,
  },
  potential_reviewing_editors: {
    keys: ['suggestedReviewingEditor', 'opposedReviewingEditor'],
    formatter: editorFormatter,
  },
  potential_reviewers: {
    keys: ['suggestedReviewer', 'opposedReviewer'],
    formatter: (member, affiliations, editorsById, reviewerMap) => {
      const { name } = member.meta
      const surname = reviewerMap[name.toLowerCase()]
      return {
        name: {
          surname,
          'given-names': name.substring(0, name.length - surname.length - 1),
        },
        email: member.meta.email,
      }
    },
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
