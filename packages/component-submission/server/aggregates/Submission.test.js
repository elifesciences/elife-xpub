const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const Team = require('@elifesciences/component-model-team').model
const AuditLog = require('@elifesciences/component-model-audit-log').model
const { keyBy } = require('lodash')

jest.mock('../utils')
const utils = require('../utils')
const Submission = require('./Submission')

const createMockObject = (values = {}, mockSaveFn) => ({
  ...values,
  toJSON: jest.fn(() => values),
  save: mockSaveFn || jest.fn(),
})

const createSubmission = (args = {}) => {
  const {
    models = { Manuscript, File, Team, AuditLog },
    services = { Storage: { getDownloadLink: jest.fn() } },
  } = args

  return new Submission({ models, services })
}

let mockManuscriptFind, mockFileFind, mockTeamFind

beforeAll(() => {
  mockManuscriptFind = jest.spyOn(Manuscript, 'find')
  mockFileFind = jest.spyOn(File, 'findByManuscriptId')
  mockTeamFind = jest.spyOn(Team, 'findByManuscriptId')
})

describe('Submission', () => {
  beforeEach(() => {
    mockManuscriptFind.mockReset()
    mockManuscriptFind.mockReturnValue(createMockObject())
    mockFileFind.mockReset()
    mockFileFind.mockReturnValue([])
    mockTeamFind.mockReset()
    mockTeamFind.mockReturnValue([])
  })

  describe('intitialize', () => {
    it('fetches and stores the manuscript and files internally', async () => {
      mockManuscriptFind.mockReturnValue('bar')
      mockFileFind.mockReturnValue('foo')
      mockTeamFind.mockReturnValue('baz')

      const submission = await createSubmission().initialize()

      expect(mockManuscriptFind).toHaveBeenCalled()
      expect(mockFileFind).toHaveBeenCalled()
      expect(mockTeamFind).toHaveBeenCalled()
      expect(submission.files).toEqual('foo')
      expect(submission.manuscript).toEqual('bar')
      expect(submission.teams).toEqual('baz')
    })
  })

  describe('toJSON', () => {
    it('returns related files as a files property of the returned object', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'STORED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await createSubmission().initialize()

      expect(submission.toJSON().files).toHaveLength(2)
      expect(submission.toJSON().files[0].url).toBe('url1')
      expect(submission.toJSON().files[1].url).toBe('url2')
    })
    it('returns an empty array for submission.files when there are no related files', async () => {
      const submission = await createSubmission().initialize()

      expect(submission.toJSON().files).toHaveLength(0)
    })
    it('gets a download link for each returned file', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'STORED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await createSubmission({
        services: { Storage: { getDownloadLink: mockGetDownloadLink } },
      }).initialize()

      const submissionJSON = submission.toJSON()
      expect(mockGetDownloadLink).toBeCalledTimes(2)
      expect(submissionJSON.files[0].downloadLink).toBe('URL:url1')
      expect(submissionJSON.files[1].downloadLink).toBe('URL:url2')
    })
    it('has a fileStatus of CHANGING if filesAreStored returns false', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await createSubmission({
        services: { Storage: { getDownloadLink: mockGetDownloadLink } },
      }).initialize()
      const filesAreStored = jest
        .spyOn(submission, 'filesAreStored')
        .mockImplementation(() => false)

      const submissionJSON = submission.toJSON()
      expect(filesAreStored).toBeCalled()
      expect(submissionJSON.fileStatus).toBe('CHANGING')
      filesAreStored.mockRestore()
    })
    it('has a fileStatus of READY if filesAreStored returns true', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await createSubmission({
        services: { Storage: { getDownloadLink: mockGetDownloadLink } },
      }).initialize()
      const filesAreStored = jest
        .spyOn(submission, 'filesAreStored')
        .mockImplementation(() => true)

      const submissionJSON = submission.toJSON()
      expect(filesAreStored).toBeCalled()
      expect(submissionJSON.fileStatus).toBe('READY')
      filesAreStored.mockRestore()
    })
  })

  describe('filesAreStored', () => {
    it('returns true if there are no related files', () => {
      const submission = new Submission({ models: {}, services: {} })
      expect(submission.files).toBe(undefined)
      expect(submission.filesAreStored()).toBe(true)
    })
    it('returns true if all related files are in a STORED or CANCELLED state', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'CANCELLED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await createSubmission().initialize()

      expect(submission.filesAreStored()).toBe(true)
    })
    it('returns false if any related files are in a CREATED state', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'CREATED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await createSubmission().initialize()

      expect(submission.filesAreStored()).toBe(false)
    })
    it('returns false if any related files are in a UPLOADED state', async () => {
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await createSubmission().initialize()

      expect(submission.filesAreStored()).toBe(false)
    })
  })
  describe('updateManuscript', () => {
    it('calls save on manuscript', async () => {
      const mockManuscriptSave = jest.fn()
      utils.mergeObjects.mockImplementationOnce(
        jest.fn(manuscript => manuscript),
      )
      jest
        .spyOn(Manuscript, 'find')
        .mockReturnValue(
          createMockObject({ status: 'INITIAL' }, mockManuscriptSave),
        )

      const submission = await createSubmission().initialize()

      await submission.updateManuscript({})
      expect(mockManuscriptSave).toBeCalled()
    })

    it('passes the correct parameters to the mergeWith function', async () => {
      const mockMergeFunction = jest.fn(manuscript => manuscript)
      utils.mergeObjects.mockImplementationOnce(mockMergeFunction)
      const mockManuscriptSave = jest.fn()
      const manuscriptMock = createMockObject(
        { status: 'INITIAL' },
        mockManuscriptSave,
      )
      jest.spyOn(Manuscript, 'find').mockReturnValue(manuscriptMock)

      const submission = await createSubmission().initialize()

      await submission.updateManuscript({})
      expect(mockMergeFunction).toBeCalledWith(manuscriptMock, {})
    })

    it('throws an error if status is not INITIAL', async () => {
      const manuscriptMock = createMockObject({ status: 'MECA_EXPORT_PENDING' })
      jest.spyOn(Manuscript, 'find').mockReturnValue(manuscriptMock)

      const submission = await createSubmission().initialize()

      expect(submission.updateManuscript({})).rejects.toThrow(
        'Cannot update manuscript with status of MECA_EXPORT_PENDING',
      )
    })
  })

  describe('updateAuthorTeam', () => {
    it('should update the author', async () => {
      const submission = await createSubmission().initialize()
      submission.updateAuthorTeam(1)

      expect(submission.teams[0]).toEqual({
        objectType: 'manuscript',
        role: 'author',
        teamMembers: [{ alias: 1, meta: { corresponding: true } }],
      })
    })

    it('should update the existing author', async () => {
      const submission = await createSubmission().initialize()
      submission.updateAuthorTeam(1)
      expect(submission.teams[0]).toEqual({
        objectType: 'manuscript',
        role: 'author',
        teamMembers: [{ alias: 1, meta: { corresponding: true } }],
      })
      submission.updateAuthorTeam(2)
      expect(submission.teams[0]).toEqual({
        objectType: 'manuscript',
        role: 'author',
        teamMembers: [{ alias: 2, meta: { corresponding: true } }],
      })
    })
  })

  describe('updateEditorTeams', () => {
    const editorOutput = {
      suggestedSeniorEditor: {
        role: 'suggestedSeniorEditor',
        objectType: 'manuscript',
        teamMembers: [{ meta: { elifePersonId: 1 } }],
      },
      opposedSeniorEditor: {
        role: 'opposedSeniorEditor',
        objectType: 'manuscript',
        teamMembers: [{ meta: { elifePersonId: 2 } }],
      },
      suggestedReviewingEditor: {
        role: 'suggestedReviewingEditor',
        objectType: 'manuscript',
        teamMembers: [{ meta: { elifePersonId: 3 } }],
      },
      opposedReviewingEditor: {
        role: 'opposedReviewingEditor',
        objectType: 'manuscript',
        teamMembers: [{ meta: { elifePersonId: 4 } }],
      },
    }

    const editorInput = {
      suggestedSeniorEditors: [1],
      opposedSeniorEditors: [2],
      suggestedReviewingEditors: [3],
      opposedReviewingEditors: [4],
    }

    it('should update the editor teams', async () => {
      const submission = await createSubmission().initialize()
      submission.updateEditorTeams(editorInput)
      const teams = keyBy(submission.teams, 'role')
      expect(teams.suggestedSeniorEditor).toEqual(
        editorOutput.suggestedSeniorEditor,
      )
      expect(teams.opposedSeniorEditor).toEqual(
        editorOutput.opposedSeniorEditor,
      )
      expect(teams.suggestedReviewingEditor).toEqual(
        editorOutput.suggestedReviewingEditor,
      )
      expect(teams.opposedReviewingEditor).toEqual(
        editorOutput.opposedReviewingEditor,
      )
    })

    it('should update the existing editor teams', async () => {
      const editors2 = {
        suggestedSeniorEditors: [5],
        opposedSeniorEditors: [6],
        suggestedReviewingEditors: [7],
        opposedReviewingEditors: [8],
      }
      const editors2Output = {
        suggestedSeniorEditor: {
          role: 'suggestedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 5 } }],
        },
        opposedSeniorEditor: {
          role: 'opposedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 6 } }],
        },
        suggestedReviewingEditor: {
          role: 'suggestedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 7 } }],
        },
        opposedReviewingEditor: {
          role: 'opposedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 8 } }],
        },
      }
      const submission = await createSubmission().initialize()
      submission.updateEditorTeams(editorInput)
      submission.updateEditorTeams(editors2)
      const teams = keyBy(submission.teams, 'role')
      expect(teams.suggestedSeniorEditor).toEqual(
        editors2Output.suggestedSeniorEditor,
      )
      expect(teams.opposedSeniorEditor).toEqual(
        editors2Output.opposedSeniorEditor,
      )
      expect(teams.suggestedReviewingEditor).toEqual(
        editors2Output.suggestedReviewingEditor,
      )
      expect(teams.opposedReviewingEditor).toEqual(
        editors2Output.opposedReviewingEditor,
      )
    })

    it('should remove a team', async () => {
      const editors2 = {
        suggestedSeniorEditors: [],
        opposedSeniorEditors: [6],
        suggestedReviewingEditors: [7],
        opposedReviewingEditors: [8],
      }
      const editors2Output = {
        suggestedSeniorEditor: {
          role: 'suggestedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [],
        },
        opposedSeniorEditor: {
          role: 'opposedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 6 } }],
        },
        suggestedReviewingEditor: {
          role: 'suggestedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 7 } }],
        },
        opposedReviewingEditor: {
          role: 'opposedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [{ meta: { elifePersonId: 8 } }],
        },
      }
      const submission = await createSubmission().initialize()
      submission.updateEditorTeams(editorInput)
      submission.updateEditorTeams(editors2)
      const teams = keyBy(submission.teams, 'role')
      expect(teams.suggestedSeniorEditor).toEqual(
        editors2Output.suggestedSeniorEditor,
      )
      expect(teams.opposedSeniorEditor).toEqual(
        editors2Output.opposedSeniorEditor,
      )
      expect(teams.suggestedReviewingEditor).toEqual(
        editors2Output.suggestedReviewingEditor,
      )
      expect(teams.opposedReviewingEditor).toEqual(
        editors2Output.opposedReviewingEditor,
      )
    })

    it('should check for conflicting editors', async () => {
      const submission = await createSubmission().initialize()

      expect(
        submission.updateEditorTeams({
          suggestedReviewingEditors: [1, 2],
          opposedReviewingEditors: [2, 3],
        }),
      ).rejects.toThrow('Same editor has been suggested and opposed')
    })
  })

  describe('updateReviewerTeams', () => {
    const reviewerInput = {
      suggestedReviewers: [1],
      opposedReviewers: [2],
    }

    it('should add reviewer teams', async () => {
      const reviewerOutput = {
        suggestedReviewer: {
          role: 'suggestedReviewer',
          objectType: 'manuscript',
          teamMembers: [{ meta: 1 }],
        },
        opposedReviewer: {
          role: 'opposedReviewer',
          objectType: 'manuscript',
          teamMembers: [{ meta: 2 }],
        },
      }
      const submission = await createSubmission().initialize()

      submission.updateReviewerTeams(reviewerInput)

      const teams = keyBy(submission.teams, 'role')

      expect(teams.suggestedReviewer).toEqual(reviewerOutput.suggestedReviewer)
      expect(teams.opposedReviewer).toEqual(reviewerOutput.opposedReviewer)
    })

    it('should update a reviewer team', async () => {
      const reviewerOutput = {
        suggestedReviewer: {
          role: 'suggestedReviewer',
          objectType: 'manuscript',
          teamMembers: [{ meta: 1 }],
        },
        opposedReviewer: {
          role: 'opposedReviewer',
          objectType: 'manuscript',
          teamMembers: [{ meta: 3 }],
        },
      }
      const submission = await createSubmission().initialize()

      submission.updateReviewerTeams(reviewerInput)
      submission.updateReviewerTeams({
        suggestedReviewers: [1],
        opposedReviewers: [3],
      })

      const teams = keyBy(submission.teams, 'role')

      expect(teams.suggestedReviewer).toEqual(reviewerOutput.suggestedReviewer)
      expect(teams.opposedReviewer).toEqual(reviewerOutput.opposedReviewer)
    })

    it('should remove a reviewer team', async () => {
      const reviewerOutput = {
        suggestedReviewer: {
          role: 'suggestedReviewer',
          objectType: 'manuscript',
          teamMembers: [],
        },
        opposedReviewer: {
          role: 'opposedReviewer',
          objectType: 'manuscript',
          teamMembers: [{ meta: 3 }],
        },
      }
      const submission = await createSubmission().initialize()

      submission.updateReviewerTeams(reviewerInput)
      submission.updateReviewerTeams({
        suggestedReviewers: [],
        opposedReviewers: [3],
      })

      const teams = keyBy(submission.teams, 'role')

      expect(teams.suggestedReviewer).toEqual(reviewerOutput.suggestedReviewer)
      expect(teams.opposedReviewer).toEqual(reviewerOutput.opposedReviewer)
    })
  })

  describe('addFile', () => {
    const manuscriptId = 'b72a1165-3eac-4477-a04a-2f38ff43abfe'
    const mockFileSave = jest.spyOn(File.prototype, 'save')
    const mockAuditLogSave = jest.spyOn(AuditLog.prototype, 'save')

    beforeEach(() => {
      mockManuscriptFind.mockReset()
      mockManuscriptFind.mockReturnValue(
        createMockObject({
          id: manuscriptId,
        }),
      )
      mockFileSave.mockReset()
      mockFileSave.mockImplementation(() => {})
      mockAuditLogSave.mockReset()
      mockAuditLogSave.mockImplementation(() => Promise.resolve())
    })

    it('should return a uuid', async () => {
      const submission = await createSubmission().initialize()
      const file = {
        filename: 'foo',
        status: 'CREATED',
        type: 'type',
        mimeType: 'mimeType',
      }

      const fileId = await submission.addFile(file)
      const v4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      )

      expect(fileId.match(v4)[0]).toEqual(fileId)
    })

    it('should add and save the file', async () => {
      const submission = await createSubmission().initialize()
      const file = {
        filename: 'foo',
        status: 'CREATED',
        type: 'type',
        mimeType: 'mimeType',
      }

      const fileId = await submission.addFile(file)
      const json = submission.toJSON()

      expect(json.files[0]).toEqual({ id: fileId, manuscriptId, ...file })
      expect(mockFileSave).toHaveBeenCalledTimes(1)
    })

    it('should update and save a file', async () => {
      const submission = await createSubmission().initialize()
      const file = {
        filename: 'foo',
        status: 'CREATED',
        type: 'type',
        mimeType: 'mimeType',
      }
      const updated = {
        filename: 'bar',
        status: 'UPLOADED',
        type: 'type2',
        mimeType: 'mimeType2',
      }

      const fileId = await submission.addFile(file)
      await submission.updateFile(fileId, updated)
      const json = submission.toJSON()

      expect(json.files[0]).toEqual({ id: fileId, manuscriptId, ...updated })
      expect(mockFileSave).toHaveBeenCalledTimes(2)
    })

    it('should throw an error if file does not exist', async () => {
      const submission = await createSubmission().initialize()
      await expect(submission.updateFile('id', {})).rejects.toThrowError(
        'Could not find file with id: id',
      )
    })
  })
})
