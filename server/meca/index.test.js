const JsZip = require('jszip')
const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')
const { createTables } = require('@pubsweet/db-manager')
const Replay = require('replay')
const sampleManuscript = require('./index.test.data')
const { generate } = require('.')

Replay.fixtures = `${__dirname}/test/http-mocks`

let manuscriptId

describe('MECA integration test', () => {
  beforeEach(async () => {
    await createTables(true)
    const { id } = await ManuscriptManager.save(sampleManuscript)
    manuscriptId = id
  })

  it('generates an archive with the right files', async () => {
    const buffer = await generate(manuscriptId)
    const zip = await JsZip.loadAsync(buffer)
    const fileNames = zip
      .filter(() => true)
      .map(file => file.name)
      .sort()
    expect(fileNames).toEqual([
      'article.xml',
      'cover_letter.html',
      'disclosure.pdf',
      'manifest.xml',
      'manuscript.pdf',
      'transfer.xml',
    ])
  })
})
