const testConfig = require('./testConfig')

const name = 'test'

describe(`${name} configuration`, () => {
  it('should load correct configuration', () => {
    const ignore = [
      'aws.s3.endpoint.host',
      'aws.s3.endpoint.href',
      'aws.s3.endpoint.port',
    ]
    testConfig(name, ignore)
  })
})
