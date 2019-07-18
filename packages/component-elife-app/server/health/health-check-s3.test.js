const checkS3 = require('./health-check-s3')

describe('health-check-s3', () => {
  const configEnabled = { get: jest.fn() }
  const configDisabled = {
    get: jest.fn(param => param === 'meca.s3.disableUpload'),
  }

  it('empty response when ok', async () => {
    const s3 = {
      listObjects: jest.fn((params, fn) => fn(null, 'ok')),
    }
    const response = await checkS3(configEnabled, s3)
    expect(s3.listObjects).toHaveBeenCalled()
    expect(response).toBe('')
  })

  it('bad response when empty', async () => {
    const s3 = {
      listObjects: jest.fn((params, fn) => fn(true, 'bad')),
    }
    const response = await checkS3(configEnabled, s3)
    expect(s3.listObjects).toHaveBeenCalled()
    expect(response).toBe('bad')
  })

  it('error message response when no connection', async () => {
    const s3 = {
      listObjects: jest.fn((params, fn) => {
        throw new Error('exception')
      }),
    }
    const response = await checkS3(configEnabled, s3)
    expect(s3.listObjects).toHaveBeenCalled()
    expect(response).toBe('exception')
  })

  it('DISABLED response when config has s3 disabled', async () => {
    const s3 = {
      listObjects: jest.fn((params, fn) => fn(null, 'ok')),
    }
    const response = await checkS3(configDisabled, s3)
    expect(s3.listObjects).not.toHaveBeenCalled()
    expect(response).toBe('DISABLED')
  })
})
