const xmlbuilder = require('xmlbuilder')
const lodash = require('lodash')
const config = require('config')
const elifeApi = require('@elifesciences/xpub-model/entities/user/helpers/elife-api')

const {
  articleTypeMap,
  contribStructure,
  journalMeta,
} = require('./article.helpers')
const nameSplitter = require('../services/nameSplitter')

const subjectAreas = config.get('client.majorSubjectAreas')

function createXmlObject(manuscript, editorsById, affiliations, reviewerMap) {
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
            '@subj-group-type': 'article_type',
            subject: articleTypeMap[manuscript.meta.articleType],
          },
          manuscript.meta.subjects.map(subject => ({
            'subj-group': {
              '@subj-group-type': 'subject_areas',
              subject: subjectAreas[subject],
            },
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
                  '@contrib-type': lodash.snakeCase(role),
                  ...groupInfo.formatter(
                    member,
                    affiliations,
                    editorsById,
                    reviewerMap,
                  ),
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
          'opposed-senior-editor-comment':
            manuscript.opposedSeniorEditorsReason,
          'opposed-reviewing-editor-comment':
            manuscript.opposedReviewingEditorsReason,
          'opposed-reviewer-comment': manuscript.opposedReviewersReason,
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
  const editorTypes = [
    'opposedReviewingEditor',
    'suggestedSeniorEditor',
    'opposedSeniorEditor',
    'suggestedReviewingEditor',
  ]

  const editorIds = editorTypes.reduce((ids, key) => {
    const team = manuscript.teams.find(t => t.role === key)
    if (team) {
      return ids.concat(
        team.teamMembers.map(member => member.meta.elifePersonId),
      )
    }
    return ids
  }, [])

  const editors = await elifeApi.getEditorsByPersonId(editorIds)
  const editorsById = editors.reduce(
    (accumulator, editor) => ({ ...accumulator, [editor.id]: editor }),
    {},
  )

  const affiliations = editors.map(editor => editor.aff)
  const authors = manuscript.teams.find(team => team.role === 'author')
  if (authors) {
    affiliations.push(authors.teamMembers[0].alias.aff)
  }

  const reviewers = manuscript.teams
    .filter(t => ['suggestedReviewer', 'opposedReviewer'].includes(t.role))
    .reduce((acc, team) => [...acc, ...team.teamMembers], [])

  const reviewerNames = await Promise.all(
    reviewers.map(async member => {
      const { name } = member.meta
      const surname = await nameSplitter(name)
      return [name, surname]
    }),
  )

  const reviewerMap = reviewerNames.reduce(
    (acc, [name, surname]) => ({ ...acc, [name.toLowerCase()]: surname }),
    {},
  )

  const front = createXmlObject(
    manuscript,
    editorsById,
    affiliations,
    reviewerMap,
  )
  return xmlbuilder
    .create(
      { article: { front } },
      { version: '1.0', encoding: 'UTF-8' },
      { sysID: 'JATS-journalpublishing1.dtd' },
    )
    .end({ pretty: true })
}

module.exports = generateArticleXml
