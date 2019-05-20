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
      updatedReviewerTeams: jest.fn(),
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
      updatedReviewerTeams: jest.fn(),
    }
    await updateSubmissionUseCase
      .initialize({ submission: mockSubmission })
      .execute(1, 1, { author: 'author' })
    expect(mockSubmission.updateManuscript).toHaveBeenCalled()
    expect(mockSubmission.updateAuthorTeam).toHaveBeenCalled()
    expect(mockSubmission.updateEditorTeams).toHaveBeenCalled()
    expect(mockSubmission.updatedReviewerTeams).toHaveBeenCalled()
  })
})
