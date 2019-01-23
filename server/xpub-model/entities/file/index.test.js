const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const File = require('.')
const Manuscript = require('../manuscript')

describe('Manuscript', () => {
  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
  })

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

    it('should be initialised in the CREATED state', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      await manuscript.save()
      const file = new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      })
      await file.save()
      expect(file.status).toBe('CREATED')
    })
  })
})
