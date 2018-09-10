const xmlbuilder = require('xmlbuilder')
const lodash = require('lodash')
const elifeApi = require('@elifesciences/xpub-server/entities/user/helpers/elife-api')
const {
  articleTypeMap,
  contribStructure,
  journalMeta,
} = require('./article.helpers')

function createXmlObject(manuscript, editorsById, affiliations) {
  return {
    'journal-meta': journalMeta,

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
          contrib: groupInfo.keys.reduce((contribs, role) => {
            const team = manuscript.teams.find(t => t.role === role)
            if (team) {
              return contribs.concat(
                team.teamMembers.map(member => ({
                  '@contrib-type': lodash.kebabCase(role),
                  ...groupInfo.formatter(member, affiliations, editorsById),
                })),
              )
            }

            return contribs
          }, []),
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
