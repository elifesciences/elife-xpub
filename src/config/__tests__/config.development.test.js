const testConfig = require('./testConfig')

const name = 'development'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
