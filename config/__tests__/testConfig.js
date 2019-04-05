const _ = require('lodash')

module.exports = (configName, ignore = []) => {
  process.env.NODE_CONFIG_ENV = configName
  const configObject = require('config')
  let config = _.cloneDeep(configObject)
  const secretKeys = [
    'aws.credentials.secretAccessKey',
    'pubsweet-server.secret',
    'server.api.secret',
  ]
  secretKeys.forEach(key => _.set(config, key, ''))

  if (ignore) {
    ignore.forEach(key => _.set(config, key, ''))
  }

  expect(config.configTag).toBe(configName)
  expect(config instanceof Object).toBeTruthy()
  const keys = Object.keys(config)
  expect(keys.length).toBeGreaterThan(10)
  expect(config).toMatchSnapshot(configName)

  // cleanup
  config = {}
  const name = require.resolve('config')
  delete require.cache[name]
}
