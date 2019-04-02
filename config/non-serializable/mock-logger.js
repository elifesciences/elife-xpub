const winston = require('winston')

const logPath = process.env.XPUB_LOG_PATH || './'

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logPath}/xpub.log` }),
  ],
})

logger.transports.console.level = 'warn'

module.exports = logger
