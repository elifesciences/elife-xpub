const SFTPServer = require('node-sftp-server')
const MemoryFilesystem = require('memory-fs')

function startServer(port) {
  const sftp = new SFTPServer({ privateKeyFile: `${__dirname}/mock-key` })
  const mockFs = new MemoryFilesystem()

  sftp.on('connect', auth => {
    if (
      auth.method !== 'password' ||
      auth.username !== 'test' ||
      auth.password !== 'tset'
    ) {
      auth.reject(['password'], false)
      return
    }

    auth.accept(session => {
      session.on('rename', (oldPath, newPath, context) => {
        mockFs.writeFileSync(newPath, mockFs.readFileSync(oldPath))
        mockFs.unlinkSync(oldPath)
        context.ok()
      })
      session.on('writefile', (path, readstream) => {
        const stream = mockFs.createWriteStream(path)
        readstream.pipe(stream)
      })
      session.on('mkdir', (path, context) => {
        mockFs.mkdirSync(path)
        context.ok()
      })
    })
  })
  sftp.on('error', err => console.warn(err)) // eslint-disable-line no-console

  const server = sftp.listen(port)

  return { mockFs, server }
}

module.exports = startServer
