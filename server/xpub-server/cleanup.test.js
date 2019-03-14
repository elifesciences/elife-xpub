const EventEmitter = require('events')
const cleanup = require('./cleanup')

// eslint-disable-next-line no-unused-vars

class DummyProcess extends EventEmitter {
  constructor() {
    super()
    this.exitValue = null
  }

  exit(value) {
    this.exitValue = value
    this.emit('exit')
  }
}

describe('handle exiting', () => {
  // eslint-disable-next-line no-unused-vars
  let cleanupHandler
  let process
  let logger
  let stopServer

  beforeEach(() => {
    stopServer = jest.fn()
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    }
    process = new DummyProcess()
    cleanupHandler = cleanup.Cleanup(process, logger, stopServer)
  })

  it('exit calls stopServer', () => {
    process.emit('exit')
    expect(stopServer).toHaveBeenCalledTimes(1)
  })

  it('SIGINT exits as expected', () => {
    process.emit('SIGINT')
    expect(process.exitValue).toBe(2)
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledTimes(0)
  })

  it('SIGTERM exits as expected', () => {
    process.emit('SIGTERM')
    expect(process.exitValue).toBe(3)
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledTimes(0)
  })

  it('uncaughtException exits as expected', () => {
    process.emit('uncaughtException', { stack: 'divide by zero' })
    expect(process.exitValue).toBe(9)
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(0)
    expect(logger.error).toHaveBeenCalledTimes(2)
    expect(logger.error.mock.calls).toEqual([
      ['Uncaught Exception...'],
      ['divide by zero'],
    ])
  })
})
