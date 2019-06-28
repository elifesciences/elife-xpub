const testConfig = require('./testConfig')

const name = 'blah'

describe(`${name} configuration`, () => {
  it('should load default configuration', () => {
    testConfig('default')
  })
})
