const config = require('config')
const path = require('path')
const { Router } = require('express')
const { serve } = require('dar-server')

module.exports = app => {
  const router = new Router()
  serve(router, {
    serverUrl: config.get('pubsweet-server.baseUrl'),
    rootDir: path.resolve(config.get('darServer.basePath')),
  })
  app.use('/api/dar', router)
}
