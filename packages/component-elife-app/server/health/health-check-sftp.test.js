const checkSFTP = require('./health-check-sftp')

describe('health-check-sftp', () => {
  const configEnabled = { get: jest.fn() }
  const configDisabled = {
    get: jest.fn(param => param === 'meca.sftp.disableUpload'),
  }

  it('empty response when ok', async () => {
    const sftp = {
      connect: jest.fn(),
      end: jest.fn(),
    }
    const response = await checkSFTP(configEnabled, sftp)
    expect(sftp.connect).toHaveBeenCalled()
    expect(response).toBe('')
  })

  it('error message response when exception thrown', async () => {
    const sftp = {
      connect: jest.fn(() => {
        throw new Error('exception')
      }),
      end: jest.fn(),
    }
    const response = await checkSFTP(configEnabled, sftp)
    expect(sftp.connect).toHaveBeenCalled()
    expect(response).toBe('exception')
  })

  it('DISABLED response when config has sftp disabled', async () => {
    const sftp = {
      connect: jest.fn(),
      end: jest.fn(),
    }
    const response = await checkSFTP(configDisabled, sftp)
    expect(sftp.connect).not.toHaveBeenCalled()
    expect(response).toBe('DISABLED')
  })
})
