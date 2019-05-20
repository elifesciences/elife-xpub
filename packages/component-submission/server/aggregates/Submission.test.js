const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const Team = require('@elifesciences/component-model-team').model

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
    models = { Manuscript, File, Team },
    services = { Storage: { getDownloadLink: jest.fn() } },
  } = args

  return new Submission({ models, services })
}

describe('Submission', () => {
  let mockManuscriptFind, mockFileFind, mockTeamFind

  beforeAll(() => {
    mockManuscriptFind = jest.spyOn(Manuscript, 'find')
    mockFileFind = jest.spyOn(File, 'findByManuscriptId')
    mockTeamFind = jest.spyOn(Team, 'findByManuscriptId')
  })

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
        .mockReturnValue(createMockObject({}, mockManuscriptSave))

      const submission = await createSubmission().initialize()

      submission.updateManuscript({})
      expect(mockManuscriptSave).toBeCalled()
    })

    it('pases the correct parameters to the mergeWith function', async () => {
      const mockMergeFunction = jest.fn(manuscript => manuscript)
      utils.mergeObjects.mockImplementationOnce(mockMergeFunction)
      const mockManuscriptSave = jest.fn()
      const manuscriptMock = createMockObject({}, mockManuscriptSave)
      jest.spyOn(Manuscript, 'find').mockReturnValue(manuscriptMock)

      const submission = await createSubmission().initialize()

      submission.updateManuscript({})
      expect(mockMergeFunction).toBeCalledWith(manuscriptMock, {})
    })
  })

  describe('updateAuthorTeam', () => {})

  describe('updateEditorTeams', () => {})

  describe('updateReviewerTeams', () => {})
})
