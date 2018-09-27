const winston = require('winston')

// production logger sends JSON lines to file
const logPath = process.env.XPUB_LOG_PATH || '/srv/elife-xpub/var/logs'
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logPath}/xpub.log` }),
  ],
})

module.exports = logger
