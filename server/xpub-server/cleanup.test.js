const EventEmitter = require('events')
const cleanup = require('./cleanup').CleanupUnwrapped

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
  let asyncFnCalled

  beforeEach(() => {
    asyncFnCalled = false
    stopServer = jest.fn()
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    }
    process = new DummyProcess()
    process.kill = jest.fn()
  })

  it('exit calls stopServer', () => {
    cleanupHandler = cleanup(1, 'exit', process, logger, stopServer)
    expect(stopServer).toHaveBeenCalledTimes(1)
  })

  it('SIGINT exits as expected', () => {
    cleanupHandler = cleanup(2, 'SIGINT', process, logger, stopServer)
    expect(process.exitValue).toBe(2)
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledTimes(0)
    expect(process.kill).toHaveBeenCalledTimes(0)
  })

  it('SIGTERM does not exit as expected', () => {
    cleanupHandler = cleanup(3, 'SIGTERM', process, logger, stopServer)
    expect(process.exitValue).toBeNull()
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledTimes(0)
    expect(process.kill).toHaveBeenCalledTimes(0)
  })

  it('uncaughtException exits as expected', () => {
    cleanupHandler = cleanup(
      9,
      'uncaughtException',
      process,
      logger,
      stopServer,
    )
    process.emit('uncaughtException', { stack: 'divide by zero' })
    expect(process.exitValue).toBe(9)
    expect(stopServer).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(0)
    expect(logger.error).toHaveBeenCalledTimes(2)
    expect(process.kill).toHaveBeenCalledTimes(0)
    expect(logger.error.mock.calls).toEqual([
      ['Uncaught Exception...'],
      ['divide by zero'],
    ])
  })

  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

  const someAsyncTask = async () => {
    await timeout(200)
    asyncFnCalled = true
  }

  it('SIGTERM kills the process after async task', done => {
    const asyncFn = async cb => {
      await someAsyncTask()
      cb() // invoke callback to kill the task
      expect(process.kill).toHaveBeenCalledTimes(1)
      expect(asyncFnCalled).toBe(true)
      done() // tell jest we are done
    }
    stopServer = () => asyncFn
    cleanupHandler = cleanup(3, 'SIGTERM', process, logger, stopServer)
  })
})
