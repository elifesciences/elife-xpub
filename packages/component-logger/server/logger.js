const winston = require('winston')
const emailFilter = require('./filters/emailFilter')

// production logger sends JSON lines to file
const logPath = process.env.XPUB_LOG_PATH || '~/elife-xpub/var/logs'
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logPath}/xpub.log` }),
  ],
  filters: [emailFilter],
})

module.exports = logger
