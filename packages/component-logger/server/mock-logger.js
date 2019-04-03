const winston = require('winston')
const emailFilter = require('./filters/emailFilter')

const logPath = process.env.XPUB_LOG_PATH || './'

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logPath}/xpub.log` }),
  ],
  filters: [emailFilter],
})

logger.transports.console.level = 'warn'

module.exports = logger
