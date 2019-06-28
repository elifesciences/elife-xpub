module.exports = (user, operation, object) => {
  console.log('Authsome blocked request', { user, operation, object }) // eslint-disable-line no-console
  return false
}
