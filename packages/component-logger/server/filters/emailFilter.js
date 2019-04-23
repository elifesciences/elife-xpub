function emailFilter(level, msg) {
  return msg.replace(
    /[\w\d!#$%&'*+\-/=?^_`{|}~@]+@[\w\d-]+\.[^\s@,"]+/g,
    '***@***.***',
  )
}

module.exports = emailFilter
