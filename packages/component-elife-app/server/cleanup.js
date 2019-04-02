// https://stackoverflow.com/a/21947851
//
// Object to capture target exits and call app specific cleanup function

const noOp = () => {}

exports.Cleanup = function Cleanup(target, logger, cb) {
  // attach user callback to the target event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  const callback = cb || noOp
  target.on('cleanup', callback)

  // do app specific cleaning before exiting
  target.on('exit', () => {
    target.emit('cleanup')
  })

  // catch ctrl+c event and exit normally
  target.on('SIGINT', () => {
    logger.info('Ctrl-C...')
    target.exit(2)
  })

  target.on('SIGTERM', () => {
    logger.info('SIGTERM...')
    target.exit(3)
  })

  // catch uncaught exceptions, trace, then exit normally
  target.on('uncaughtException', e => {
    logger.error('Uncaught Exception...')
    logger.error(e.stack)
    target.exit(9)
  })
}
