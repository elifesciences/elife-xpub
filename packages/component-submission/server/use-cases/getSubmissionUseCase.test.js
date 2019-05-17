const getSubmissionUseCase = require('./getSubmissionUseCase')

describe('getSubmissionUseCase', () => {
  it('initializes the submission object', async () => {
    const mockInitialize = jest.fn()
    const mockSubmission = { initialize: mockInitialize, toJSON: jest.fn() }
    await getSubmissionUseCase
      .initialize({ submission: mockSubmission })
      .execute()
    expect(mockInitialize).toHaveBeenCalled()
  })
  it('calls and returns the value of submission.toJSON()', async () => {
    const mockToJSON = jest.fn(() => 'foo')
    const mockSubmission = { initialize: jest.fn(), toJSON: mockToJSON }
    expect(
      await getSubmissionUseCase
        .initialize({ submission: mockSubmission })
        .execute(),
    ).toBe('foo')
    expect(mockToJSON).toHaveBeenCalled()
  })
})
