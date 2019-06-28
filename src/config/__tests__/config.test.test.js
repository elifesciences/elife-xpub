const testConfig = require('./testConfig')

const name = 'test'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
