const JsZip = require('jszip')
const config = require('config')
const Replay = require('replay')
const { createTables } = require('@pubsweet/db-manager')
const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')
const startSftpServer = require('./test/mock-sftp-server')
const sampleManuscript = require('./index.test.data')
const mecaExport = require('.')

Replay.fixtures = `${__dirname}/test/http-mocks`

describe('MECA integration test', () => {
  let manuscriptId
  let server
  let mockFs

  beforeEach(async () => {
    const sftp = startSftpServer(config.get('meca.sftp.port'))
    server = sftp.server
    mockFs = sftp.mockFs

    await createTables(true)
    const { id } = await ManuscriptManager.save(sampleManuscript)
    manuscriptId = id
  })

  afterEach(done => server.close(done))

  it('generates an archive and uploads it', async () => {
    await send(manuscriptId, sampleManuscript.createdBy)

    expect(mockFs.readdirSync('/')).toEqual(['test'])
    expect(mockFs.readdirSync('/test')).toEqual([manuscriptId])

    const zip = await JsZip.loadAsync(
      mockFs.readFileSync(`/test/${manuscriptId}`),
    )
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
