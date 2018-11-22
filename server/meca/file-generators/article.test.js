const { createTables } = require('@pubsweet/db-manager')
const path = require('path')
const config = require('config')
const { db } = require('pubsweet-server')
const generateXml = require('./article')
const Replay = require('replay')
const sampleManuscript = require('./article.test.data')

// Ref: https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
const appRoot = process.cwd()
const { obfuscateEmail } = require(path.join(appRoot, '/scripts/obfuscate'))

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
    let xml = await generateXml(sampleManuscript)
    xml = obfuscateEmail(xml)
    if (config.get('server.api.secret')) expect(xml).toMatchSnapshot()
    else expect(xml).toMatchSnapshot('no-secret')
  })
})
