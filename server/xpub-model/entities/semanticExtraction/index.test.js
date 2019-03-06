const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const SemanticExtraction = require('.')

describe('SemanticExtraction', () => {
  beforeEach(async () => {
    await createTables(true)
  })

  it('should save to the database', async () => {
    const semanticExtraction = await new SemanticExtraction({
      manuscriptId: uuid(),
      fieldName: 'title',
      value: 'test_title',
    }).save()
    expect(semanticExtraction.id).toBeTruthy()
  })

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
