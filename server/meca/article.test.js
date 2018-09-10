const generateXml = require('./article')
const replaySetup = require('../../test/helpers/replay-setup')
const sampleManuscript = require('./article.test.data')

replaySetup('success')

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
  [
    'related article',
    `<related-article related-article-type="companion">
        <article-title>Another</article-title>
      </related-article>`,
  ],
]

describe('Article XML generator', () => {
  describe('sample output', () => {
    test.each(snippets)('includes %s', async (name, snippet) => {
      const xml = await generateXml(sampleManuscript)
      expect(xml).toMatch(snippet)
    })
  })
})
