const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
// const { S3Storage } = require('@elifesciences/component-service-s3')
const Submission = require('./Submission')

const createMockObject = (values = {}) => ({
  ...values,
  toJSON: jest.fn(() => values),
})

describe('Submission', () => {
  describe('intitialize', () => {
    it('fetches and stores the manuscript and files internally', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue('bar')
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue('foo')

      const submission = await new Submission({
        models: { Manuscript, File },
        services: {},
      }).initialize()
      expect(mockManuscriptFind).toHaveBeenCalled()
      expect(mockFileFind).toHaveBeenCalled()
      expect(submission.files).toEqual('foo')
      expect(submission.manuscript).toEqual('bar')
    })
  })

  describe('toJSON', () => {
    it('returns related files as a files property of the returned object', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'STORED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await new Submission({
        models: { Manuscript, File },
        services: { Storage: { getDownloadLink: jest.fn() } },
      }).initialize()

      expect(submission.toJSON().files).toHaveLength(2)
      expect(submission.toJSON().files[0].url).toBe('url1')
      expect(submission.toJSON().files[1].url).toBe('url2')
    })
    it('returns an empty array for submission.files when there are no related files', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue()

      const submission = await new Submission({
        models: { Manuscript, File },
        services: { Storage: { getDownloadLink: jest.fn() } },
      }).initialize()

      expect(submission.toJSON().files).toHaveLength(0)
    })
    it('gets a download link for each returned file', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'STORED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await new Submission({
        models: { Manuscript, File },
        services: { Storage: { getDownloadLink: mockGetDownloadLink } },
      }).initialize()
      const submissionJSON = submission.toJSON()
      expect(mockGetDownloadLink).toBeCalledTimes(2)
      expect(submissionJSON.files[0].downloadLink).toBe('URL:url1')
      expect(submissionJSON.files[1].downloadLink).toBe('URL:url2')
    })
    it('has a fileStatus of CHANGING if filesAreStored returns false', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await new Submission({
        models: { Manuscript, File },
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
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])
      const mockGetDownloadLink = jest.fn(file => `URL:${file.url}`)

      const submission = await new Submission({
        models: { Manuscript, File },
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
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'CANCELLED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await new Submission({
        models: { Manuscript, File },
        services: {},
      }).initialize()

      expect(submission.filesAreStored()).toBe(true)
    })
    it('returns false if any related files are in a CREATED state', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'CREATED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await new Submission({
        models: { Manuscript, File },
        services: {},
      }).initialize()

      expect(submission.filesAreStored()).toBe(false)
    })
    it('returns false if any related files are in a UPLOADED state', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject())
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([
        createMockObject({ url: 'url1', status: 'UPLOADED' }),
        createMockObject({ url: 'url2', status: 'STORED' }),
      ])

      const submission = await new Submission({
        models: { Manuscript, File },
        services: {},
      }).initialize()

      expect(submission.filesAreStored()).toBe(false)
    })
  })
})
