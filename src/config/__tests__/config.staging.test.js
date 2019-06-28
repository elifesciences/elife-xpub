const testConfig = require('./testConfig')

const name = 'staging'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
