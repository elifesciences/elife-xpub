const { createLogger, format, transports } = require('winston')

const { combine, timestamp, label, printf } = format

console.log("L")
const myFormat = printf(({ lvl, msg, lab, t}) => {
  console.log("X")
  return `${t} [${lab}] ${lvl}: ${msg}`
})

const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
})


module.exports = logger
