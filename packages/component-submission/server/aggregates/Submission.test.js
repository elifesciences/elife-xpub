const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const Submission = require('./Submission')

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
})
