const getStatusPage = require('../statusPage')

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}

module.exports = app => {
  app.get('/ping', nocache, async (req, res) => {
    // the very fact we respond is the health check
    res.status(200).send('pong')
  })

  app.get('/status', nocache, async (req, res) => {
    const { page, code } = await getStatusPage()
    res.status(code).send(page)
  })

  require(`./publicConfig`)(app)
}
