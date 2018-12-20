const { createTables } = require('@pubsweet/db-manager')
const File = require('.')

describe('Manuscript', () => {
  beforeEach(() => createTables(true))

  describe('delete File', () => {
    it('should fail if id is not provided when deleting the file', async () => {
      const file = new File()
      let response
      const error = new Error(
        "one of the identifier columns [id] is null or undefined. Have you specified the correct identifier column for the model 'File' using the 'idColumn' property?",
      )
      try {
        response = await file.delete()
      } catch (err) {
        response = err
      }
      expect(response).toEqual(error)
    })

    it('if should delete the file', async () => {
      const file = new File({
        manuscriptId: '1',
        id: 'c99c5243-65fb-4679-9672-ab8cb2bd7653',
        url: '/an/url',
      })
      const response = await file.delete()
      expect(response).toBeTruthy()
    })
  })
})
