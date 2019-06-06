const { createTables } = require('@elifesciences/component-model')
const uuid = require('uuid')
const SemanticExtraction = require('.')

describe('SemanticExtraction', () => {
  beforeEach(async () => {
    await createTables(true)
  })

  describe('save()', () => {
    it('should save to the database', async () => {
      const semanticExtraction = await new SemanticExtraction({
        manuscriptId: uuid(),
        fieldName: 'title',
        value: 'test_title',
      }).save()
      expect(semanticExtraction.id).toBeTruthy()
    })
  })

  describe('delete()', () => {
    it('if should throw an unsupported error', async () => {
      const semanticExtraction = new SemanticExtraction()
      const error = new Error('Unsupported operation')
      let response
      try {
        response = await semanticExtraction.delete()
      } catch (err) {
        response = err
      }
      expect(response).toEqual(error)
    })
  })

  describe('createTitleEntity', () => {
    it('return an entity with title filedName when called', () => {
      const titleExtraction = SemanticExtraction.createTitleEntity(
        'manuscriptId',
      )
      expect(titleExtraction.fieldName).toBe('title')
    })
  })

  describe('findByManuscriptId', () => {
    it('return an entity with title filedName when called', () => {
      const titleExtraction = SemanticExtraction.createTitleEntity(
        'manuscriptId',
      )
      expect(titleExtraction.fieldName).toBe('title')
      const result = SemanticExtraction.findByManuscriptId(
        titleExtraction.manuscriptId,
      )
      expect(result).toHaveProperty('title')
      expect(result.title).toBe('test_title')
    })
  })
})
