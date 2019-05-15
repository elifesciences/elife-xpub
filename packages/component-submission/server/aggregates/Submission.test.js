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
        createMockObject({ url: 'url1' }),
        createMockObject({ url: 'url2' }),
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
        createMockObject({ url: 'url1' }),
        createMockObject({ url: 'url2' }),
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
  })
})
