const _ = require('lodash')

const MAX_DEPTH = 10

const getKeys = (obj, root = '') => {
  const keys = Object.keys(obj)
  const kList = keys
    .map(k => {
      const o = _.get(obj, k)
      const name = root.length > 0 ? `${root}.${k}` : k
      const depth = (root.match(new RegExp('.', 'g')) || []).length
      if (o && o instanceof Object && depth < MAX_DEPTH) {
        return getKeys(o, name)
      }
      return name
    })
    .reduce((acc, value) => acc.concat(value), [])
  return kList
}

module.exports = configName => {
  process.env.NODE_CONFIG_ENV = configName
  const configObject = require('config')
  let config = _.cloneDeep(configObject)
  expect(config.configTag).toBe(configName)

  config = getKeys(config)
  config = config.filter(value => value !== 'pubsweet-server.secret')
  expect(config).toMatchSnapshot('config-keys')
}
