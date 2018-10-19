const winston = require('winston')

const logger = new winston.Logger({
  transports: [new winston.transports.Console()],
})

logger.transports.console.level = 'warn'

module.exports = logger
