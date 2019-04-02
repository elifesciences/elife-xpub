function emailFilter(level, msg) {
  return msg.replace(/[^\s@]+@[^@,"]+\.[^\s@,"]+/g, '***@***.***')
}

module.exports = emailFilter
