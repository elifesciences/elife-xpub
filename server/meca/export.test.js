const JsZip = require('jszip')
const config = require('config')
const Replay = require('replay')
const startS3Server = require('@elifesciences/xpub-server/test/mock-s3-server')
const startSftpServer = require('./test/mock-sftp-server')
const sampleManuscript = require('./export.test.data')
const mecaExport = require('./export')

Replay.fixtures = `${__dirname}/test/http-mocks`
const mecaPostfix = '-meca.zip'

const getFilenames = zip =>
  zip
    // get all files from zip
    .file(/./)
    .map(file => file.name)
    .sort()

const getFileSizes = zip =>
  zip.file(/./).reduce(
    (accum, file) => ({
      ...accum,
      [file.name]: file._data.uncompressedSize,
    }),
    {},
  )

describe('MECA integration test', () => {
  let sftp, s3Server, s3

  beforeEach(async () => {
    // setup mock sftp server
    sftp = startSftpServer(config.get('meca.sftp.connectionOptions.port'))

    // setup mock S3 server
    const server = await startS3Server({
      ...config.get('aws.credentials'),
      ...config.get('aws.s3'),
    })
    s3Server = server.instance
    s3 = server.s3
  })

  afterEach(done => {
    sftp.server.close(() => {
      s3Server.close(done)
    })
  })

  describe('when generating an archive', () => {
    it('should contain the correct files', async () => {
      await mecaExport(sampleManuscript, 'This is a test')

      const finalName = `${sampleManuscript.id}${mecaPostfix}`
      const filename = `/test/${finalName}`

      expect(sftp.mockFs.existsSync(filename)).toBeTruthy()
      const zip = await JsZip.loadAsync(sftp.mockFs.readFileSync(filename))

      expect(getFileSizes(zip)).toMatchSnapshot({
        'article.xml': expect.any(Number),
        'disclosure.pdf': expect.any(Number),
      })

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

  it('uploads archive to SFTP', async () => {
    await mecaExport(sampleManuscript, 'This is a test')

    expect(sftp.mockFs.readdirSync('/')).toEqual(['test'])
    const finalName = `${sampleManuscript.id}${mecaPostfix}`
    expect(sftp.mockFs.readdirSync('/test')).toEqual([finalName])

    const zip = await JsZip.loadAsync(
      sftp.mockFs.readFileSync(`/test/${finalName}`),
    )

    expect(zip).toBeTruthy()
  })

  it('uploads archive to S3', async () => {
    await mecaExport(sampleManuscript, '')

    const objectKey = `${config.get('meca.s3.remotePath')}/${
      sampleManuscript.id
    }${mecaPostfix}`
    const responseData = await s3.getObject({ Key: objectKey }).promise()
    const zip = await JsZip.loadAsync(responseData.Body)

    expect(zip).toBeTruthy()
  })
})
