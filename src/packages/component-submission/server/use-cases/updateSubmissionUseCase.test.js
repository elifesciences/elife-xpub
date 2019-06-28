const updateSubmissionUseCase = require('./updateSubmissionUseCase')

describe('updateSubmissionUseCase', () => {
  it('initializes the submission aggregate', async () => {
    const mockInitialize = jest.fn()
    const mockSubmission = {
      initialize: mockInitialize,
      toJSON: jest.fn(),
      updateManuscript: jest.fn(),
      updateAuthorTeam: jest.fn(),
      updateEditorTeams: jest.fn(),
      updateReviewerTeams: jest.fn(),
    }
    await updateSubmissionUseCase
      .initialize({ submission: mockSubmission })
      .execute(1, 1, { author: 'author' })
    expect(mockInitialize).toHaveBeenCalled()
  })

  it('calls update functions', async () => {
    const mockSubmission = {
      initialize: jest.fn(),
      toJSON: jest.fn(),
      updateManuscript: jest.fn(),
      updateAuthorTeam: jest.fn(),
      updateEditorTeams: jest.fn(),
      updateReviewerTeams: jest.fn(),
    }
    await updateSubmissionUseCase
      .initialize({ submission: mockSubmission })
      .execute(1, 1, { author: 'author' })
    expect(mockSubmission.updateManuscript).toHaveBeenCalled()
    expect(mockSubmission.updateAuthorTeam).toHaveBeenCalled()
    expect(mockSubmission.updateEditorTeams).toHaveBeenCalled()
    expect(mockSubmission.updateReviewerTeams).toHaveBeenCalled()
  })

  it('returns a submission json', async () => {
    const mockSubmission = {
      initialize: jest.fn(),
      toJSON: jest.fn().mockReturnValue({ foo: 'bar' }),
      updateManuscript: jest.fn(),
      updateAuthorTeam: jest.fn(),
      updateEditorTeams: jest.fn(),
      updateReviewerTeams: jest.fn(),
    }
    const spy = jest.spyOn(mockSubmission, 'toJSON')

    const result = await updateSubmissionUseCase
      .initialize({ submission: mockSubmission })
      .execute(1, 1, { author: 'author' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ foo: 'bar' })
  })
})
