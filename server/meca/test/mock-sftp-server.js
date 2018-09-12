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
  sftp.on('error', err => console.warn(err))

  const server = sftp.listen(port)

  return { mockFs, server }
}

module.exports = startServer
