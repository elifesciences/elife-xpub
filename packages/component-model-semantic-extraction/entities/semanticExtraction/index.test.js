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
      }).saveGraph()
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
        'test title',
      )
      expect(titleExtraction.fieldName).toBe('title')
      expect(titleExtraction.value).toBe('test title')
    })
  })

  describe('findByManuscriptId', () => {
    it('return an entity with title filedName when called', async () => {
      const id = uuid()
      const titleExtraction = SemanticExtraction.createTitleEntity(id, 'abc123')
      expect(titleExtraction.fieldName).toBe('title')
      await titleExtraction.saveGraph()

      const result = await SemanticExtraction.findByManuscriptId(id)
      expect(result).toHaveLength(1)

      expect(result[0]).toHaveProperty('fieldName')
      expect(result[0].fieldName).toBe('title')

      expect(result[0]).toHaveProperty('value')
      expect(result[0].value).toBe('abc123')
    })
  })
})
