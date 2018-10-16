const { createTables } = require('@pubsweet/db-manager')
const { db } = require('pubsweet-server')
const generateXml = require('./article')
const Replay = require('replay')
const sampleManuscript = require('./article.test.data')

const existingNames = [{ id: 1, first: 'J. Edward', last: 'Reviewer' }]

Replay.fixtures = `${__dirname}/../test/http-mocks`

describe('Article XML generator', () => {
  beforeAll(async () => {
    await createTables(true)
    await db.table('ejp_name').insert(existingNames)
  })

  it("doesn't choke on missing teams", async () => {
    const manuscriptWithoutTeams = { ...sampleManuscript, teams: [] }
    await generateXml(manuscriptWithoutTeams)
  })

  it('generates expected XML', async () => {
    const xml = await generateXml(sampleManuscript)
    expect(xml).toMatchSnapshot()
  })
})
