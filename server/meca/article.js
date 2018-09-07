const xmlbuilder = require('xmlbuilder')
const lodash = require('lodash')
const elifeApi = require('@elifesciences/xpub-server/entities/user/helpers/elife-api')

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

function createXmlObject(manuscript, editorsById, affiliations) {
  return {
    'journal-meta': {
      'journal-id': [
        { '@journal-id-type': 'pmc' },
        { '@journal-id-type': 'publisher' },
      ],
      issn: {},
      publisher: {
        'publisher-name': {},
      },
    },

    'article-meta': {
      'article-id': {
        '@pub-id-type': 'manuscript',
        '#text': manuscript.id,
      },
      'article-categories': {
        'subj-group': [].concat(
          {
            '@subj-group-type': 'article-type',
            subject: manuscript.meta.articleType,
          },
          {
            '@subj-group-type': 'article-type-id',
            subject: articleTypeMap[manuscript.meta.articleType],
          },
          manuscript.meta.subjects.map(subject => ({
            'subj-group': { '@subj-group-type': 'keywords', subject },
          })),
        ),
      },
      'title-group': {
        'article-title': manuscript.meta.title,
      },

      'contrib-group': Object.entries(contribStructure).map(
        ([group, groupInfo]) => ({
          '@content-type': group,
          contrib: groupInfo.keys.reduce(
            (contribs, role) =>
              contribs.concat(
                manuscript.teams
                  .find(team => team.role === role)
                  .teamMembers.map(member => ({
                    '@contrib-type': lodash.kebabCase(role),
                    ...groupInfo.formatter(member, affiliations, editorsById),
                  })),
              ),
            [],
          ),
        }),
      ),

      aff: affiliations.map((aff, index) => ({
        '@id': `aff${index}`,
        institution: aff,
      })),

      'author-notes': { fn: { p: {} } },
      'pub-date': { day: '', month: '', year: '' },

      'related-article': manuscript.cosubmission.map(title => ({
        '@related-article-type': 'companion',
        'article-title': title,
      })),

      'custom-meta-group': {
        'custom-meta': Object.entries({
          'suggestions-conflict': manuscript.suggestionsConflict,
          'previously-discussed': manuscript.previouslyDiscussed,
          'previously-submitted': manuscript.previouslySubmitted[0],
          'created-by': manuscript.createdBy,
        })
          .filter(([name, value]) => value)
          .map(([name, value]) => ({ 'meta-name': name, 'meta-value': value })),
      },
    },
  }
}

async function generateArticleXml(manuscript) {
  const editorIds = [
    'opposedReviewingEditor',
    'suggestedSeniorEditor',
    'opposedSeniorEditor',
    'suggestedReviewingEditor',
  ].reduce(
    (ids, key) =>
      ids.concat(
        manuscript.teams
          .find(team => team.role === key)
          .teamMembers.map(member => member.meta.elifePersonId),
      ),
    [],
  )

  const editors = await elifeApi.peopleById(editorIds)
  const editorsById = editors.reduce(
    (accumulator, editor) => ({ ...accumulator, [editor.id]: editor }),
    {},
  )

  const affiliations = [
    manuscript.teams.find(team => team.role === 'author').teamMembers[0].alias
      .aff,
  ].concat(editors.map(editor => editor.aff))

  const front = createXmlObject(manuscript, editorsById, affiliations)
  return xmlbuilder
    .create(
      { article: { front } },
      { version: '1.0', encoding: 'UTF-8' },
      { sysID: 'JATS-journalpublishing1.dtd' },
    )
    .end({ pretty: true })
}

module.exports = generateArticleXml
