const testConfig = require('./testConfig')

const name = 'end2end'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    testConfig(name)
  })
})
