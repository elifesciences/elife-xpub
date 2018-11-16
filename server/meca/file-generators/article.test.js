const config = require('config')
const { createTables } = require('@pubsweet/db-manager')
const { db } = require('pubsweet-server')
const generateXml = require('./article')
const Replay = require('replay')
const sampleManuscript = require('./article.test.data')
const elifeApi = require('@elifesciences/xpub-model/entities/user/helpers/elife-api')
const { obsfurcateEmail, md5 } = require('../test/obsfurcate')

const existingNames = [{ id: 1, first: 'J. Edward', last: 'Reviewer' }]

Replay.fixtures = `${__dirname}/../test/http-mocks`
const testHost = config.get('server.api.url')

describe('Article XML generator', () => {
  beforeAll(async () => {
    await createTables(true)
    await db.table('ejp_name').insert(existingNames)
  })

  it(`${testHost} has mocks configured with email using ${config.get(
    'server.api.secret',
  )}`, async () => {
    const person = await elifeApi.person('1968254f')

    expect(person.name).toBe('Arup K Chakraborty')
    expect(person.surname).toBe('Chakraborty')
    expect(person.aff).toBe('Massachusetts Institute of Technology')
    let { email } = person

    if (Replay.mode === 'record') {
      console.log(Replay)
      email = md5(email)
    }
    expect(email).toBe('b6f50a368b8bde0643d6df92a2bafd61')
  })

  it("doesn't choke on missing teams", async () => {
    const manuscriptWithoutTeams = { ...sampleManuscript, teams: [] }
    await generateXml(manuscriptWithoutTeams)
  })

  it('generates expected XML', async () => {
    let xml = await generateXml(sampleManuscript)
    if (Replay.mode === 'record') {
      xml = obsfurcateEmail(xml)
    }
    expect(xml).toMatchSnapshot()
  })
})
