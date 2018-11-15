const config = require('config')
const { createTables } = require('@pubsweet/db-manager')
const { db } = require('pubsweet-server')
const generateXml = require('./article')
const Replay = require('replay')
const sampleManuscript = require('./article.test.data')
const elifeApi = require('@elifesciences/xpub-model/entities/user/helpers/elife-api')

const existingNames = [{ id: 1, first: 'J. Edward', last: 'Reviewer' }]

Replay.fixtures = `${__dirname}/../test/http-mocks`
const testHost = config.get('server.api.url')

describe('Article XML generator', () => {
  beforeAll(async () => {
    await createTables(true)
    await db.table('ejp_name').insert(existingNames)
  })

  it(`${testHost} has test mocks configured and has email`, async () => {
    const person = await elifeApi.person('1968254f')
    expect(person.name).toBe('Arup K Chakraborty')
    expect(person.surname).toBe('Chakraborty')
    expect(person.aff).toBe('Massachusetts Institute of Technology')
    expect(person.email).toBe('person3@email.com')
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
