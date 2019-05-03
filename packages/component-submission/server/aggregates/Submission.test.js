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
    it('correctly loads files into the returned object.', async () => {
      const mockManuscriptFind = jest.spyOn(Manuscript, 'find')
      mockManuscriptFind.mockReturnValue(createMockObject({ title: 'A Title' }))
      const mockFileFind = jest.spyOn(File, 'findByManuscriptId')
      mockFileFind.mockReturnValue([createMockObject({ url: 'url' })])

      const submission = await new Submission({
        models: { Manuscript, File },
        services: {},
      }).initialize()

      expect(submission.manuscript.title).toBe('A Title')
      expect(submission.files[0]).toEqual(createMockObject({ url: 'url' }))
    })
  })
})
