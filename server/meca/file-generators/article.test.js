const { createTables } = require('@pubsweet/db-manager')
const { db } = require('pubsweet-server')
const generateXml = require('./article')
const Replay = require('replay')
const sampleManuscript = require('./article.test.data')

const existingNames = [{ id: 1, first: 'J. Edward', last: 'Reviewer' }]

Replay.fixtures = `${__dirname}/../test/http-mocks`

const snippets = [
  ['doctype', '<!DOCTYPE article SYSTEM "JATS-journalpublishing1.dtd">'],
  [
    'article id',
    '<article-id pub-id-type="manuscript">604e06ca-882d-4b5b-a147-e016893e60e9</article-id>',
  ],
  ['article type', '<subject>research-article</subject>'],
  ['article type id', '<subject>5</subject>'],
  ['subject area ID', '<subject>chromosomes-gene-expression</subject>'],
  ['title', '<article-title>Test Manuscript</article-title>'],
  ['previously discussed', '<meta-value>Talked to bob about it</meta-value>'],
  [
    'created by',
    '<meta-value>6d8cd1ce-15b6-46c1-b901-bc91598c8f2d</meta-value>',
  ],
  ['author email', '<email>elife@mailinator.com</email>'],
  ['multipart reviewer forename', '<given-names>J. Edward</given-names>'],
  ['multipart reviewer surname', '<surname>de Reviewer</surname>'],
  [
    'related article',
    `<related-article related-article-type="companion">
        <article-title>Another</article-title>
      </related-article>`,
  ],
]

describe('Article XML generator', () => {
  beforeAll(async () => {
    await createTables(true)
    await db.table('ejp_name').insert(existingNames)
  })

  describe('sample output', () => {
    test.each(snippets)('includes %s', async (name, snippet) => {
      const xml = await generateXml(sampleManuscript)
      expect(xml).toContain(snippet)
    })
  })

  it("doesn't choke on missing teams", async () => {
    const manuscriptWithoutTeams = { ...sampleManuscript, teams: [] }
    await generateXml(manuscriptWithoutTeams)
  })
})
