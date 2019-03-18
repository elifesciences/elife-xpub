const nodeCleanup = require('node-cleanup')

const noOp = () => {}

const CleanupUnwrapped = (exitCode, signal, target, logger, cb) => {
  const callback = cb || noOp
  target.on('cleanup', () => {
    // the return value of the callback can return a function that is async
    // taking a callback function with will kill the target
    const ret = callback()
    if (ret) {
      ret(() => target.kill(target.pid, signal))
    }
  })

  // uncaughtException gets handled here so we have access to the exception
  // itself.
  target.on('uncaughtException', e => {
    logger.error('Uncaught Exception...')
    logger.error(e.stack)
    target.emit('cleanup')
    target.exit(exitCode)
  })

  const killProcess = false

  if (signal) {
    switch (signal) {
      case 'uncaughtException': {
        // Overridden else where!
        break
      }
      case 'SIGINT': {
        logger.info('Ctrl-C...')
        target.emit('cleanup')
        target.exit(exitCode)
        break
      }
      case 'SIGTERM': {
        logger.info('SIGTERM...')
        target.emit('cleanup')
        break
      }
      case 'exit': {
        target.emit('cleanup')
        break
      }
      default:
        break
    }

    nodeCleanup.uninstall() // don't call cleanup handler again
  }
  return killProcess
}

const Cleanup = (target, logger, cb) =>
  nodeCleanup((exitCode, signal) =>
    CleanupUnwrapped(exitCode, signal, target, logger, cb),
  )

module.exports = {
  Cleanup,
  CleanupUnwrapped,
}
