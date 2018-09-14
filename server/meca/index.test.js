const util = require('util')
const JsZip = require('jszip')
const config = require('config')
const Replay = require('replay')
const { createTables } = require('@pubsweet/db-manager')
const ManuscriptManager = require('@elifesciences/xpub-server/entities/manuscript')
const startSftpServer = require('./test/mock-sftp-server')
const startS3Server = require('./test/mock-s3-server')
const sampleManuscript = require('./index.test.data')
const mecaExport = require('.')

Replay.fixtures = `${__dirname}/test/http-mocks`

const getFilenames = zip => zip
  .filter(() => true)
  .map(file => file.name)
  .sort()

describe('MECA integration test', () => {
  let manuscriptId
  let sftp, s3Server, s3

  beforeEach(async () => {
    // setup mock sftp server
    sftp = startSftpServer(config.get('meca.sftp.port'))

    // setup mock S3 server
    const server = await startS3Server(config.get('meca.s3'))
    s3Server = server.instance
    s3 = server.s3

    // setup stub data in test database
    await createTables(true)
    const { id } = await ManuscriptManager.save(sampleManuscript)
    manuscriptId = id
  })

  afterEach(done => {
    sftp.server.close(() => {
      s3Server.close(done)
    })
  })

  it('generates an archive and uploads it', async () => {
    await send(manuscriptId, sampleManuscript.createdBy)

    expect(sftp.mockFs.readdirSync('/')).toEqual(['test'])
    expect(sftp.mockFs.readdirSync('/test')).toEqual([manuscriptId])

    const zip = await JsZip.loadAsync(
      sftp.mockFs.readFileSync(`/test/${manuscriptId}`),
    )

    expect(getFilenames(zip)).toEqual([
      'article.xml',
      'cover_letter.html',
      'disclosure.pdf',
      'manifest.xml',
      'manuscript.pdf',
      'transfer.xml',
    ])
  })

  it('generates an archive and uploads it to S3', async () => {
    await send(manuscriptId)

    console.log({
          ...config.get('meca.s3.params'),
          Key: manuscriptId
    })

    const zip = await JsZip.loadAsync(
      new Promise((resolve, reject) => {
        s3.getObject({
          ...config.get('meca.s3.params'),
          Key: manuscriptId
        }, (err, data) => {
          if(err) reject(err)
          resolve(data)
        })
      })
    )

    expect(getFilenames(zip)).toEqual([
      'article.xml',
      'cover_letter.html',
      'disclosure.pdf',
      'manifest.xml',
      'manuscript.pdf',
      'transfer.xml',
    ])
  })
})
