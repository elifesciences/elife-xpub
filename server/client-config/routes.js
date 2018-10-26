const config = require('config')
const { pickBy } = require('lodash')
const DBExists = require('@pubsweet/db-manager/src/helpers/db-exists.js')

const template = clientConfig => `
  window.config = ${JSON.stringify(clientConfig)}
`
const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}

module.exports = app => {
  app.get('/config.js', (req, res) => {
    const clientConfig = pickBy(config, value => value.isPublic)
    const response = template(clientConfig)
    res.type('js')
    res.send(response)
  })

  app.get('/ping', nocache, async (req, res) => {
    try {
      const exists = await DBExists()
      if (!exists) {
        res.send(404, 'database error')
      }
      // TODO: cretate a function to check S3 connection
      // let responseS3 = await checkS3();
      res.send('pong')
    } catch (error) {
      res.send(500, 'ko')
    }
  })
}
