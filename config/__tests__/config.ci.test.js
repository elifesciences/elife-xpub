const testConfig = require('./testConfig')

const name = 'ci'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
