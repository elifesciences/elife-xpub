module.exports = (user, operation, object) => {
  console.log('Authsome blocked request', { user, operation, object })
  return false
}
