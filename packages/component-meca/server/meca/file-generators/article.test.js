const { createTables } = require('@elifesciences/component-model')
const path = require('path')
const { db } = require('@pubsweet/db-manager')
const Replay = require('replay')

// Ref: https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
const appRoot = process.cwd()
const { obfuscateEmail } = require(path.join(appRoot, '/scripts/obfuscate'))

jest.mock('config')
const config = require('config')

const realConfig = jest.requireActual('config')
config.get.mockImplementation(key => {
  if (key === 'server.api.secret') return config.secret

  return realConfig.get(key)
})

const generateXml = require('./article')
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

  it('generates expected XML when secret is empty', async () => {
    config.secret = ''
    const xml = await generateXml(sampleManuscript)
    expect(obfuscateEmail(xml)).toMatchSnapshot()
  })

  it('generates expected XML when secret is set', async () => {
    config.secret =
      Replay.mode === 'replay'
        ? 'some-secret'
        : realConfig.get('server.api.secret')

    const xml = await generateXml(sampleManuscript)
    expect(obfuscateEmail(xml)).toMatchSnapshot()
  })
})
