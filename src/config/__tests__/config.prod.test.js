const testConfig = require('./testConfig')

const name = 'prod'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
