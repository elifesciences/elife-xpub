const { createTables } = require('@elifesciences/component-model')
const uuid = require('uuid')
const File = require('.')
const Manuscript = require('@elifesciences/component-model-manuscript').model

describe('File', () => {
  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
  })

  describe('constructor', () => {
    it('sets the status to undefined, even with a default within the schema', async () => {
      const file = new File({
        manuscriptId: '1',
        filename: 'thisfile.txt',
        url: '/an/url',
      })
      expect(file.status).toBe(undefined)
    })
  })

  describe('save()', () => {
    it('should set the status to CREATED', async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
      }).save()
      const file = await new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      }).save()
      expect(file.status).toBe('CREATED')
    })
  })

  describe('delete()', () => {
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

  describe('updateStatus()', () => {
    it('sets file status to value passed', async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
      }).save()
      let file = await new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      }).save()
      expect(file.status).toBe('CREATED')
      file = await File.find(file.id)
      await file.updateStatus('UPLOADED')
      expect(file.status).toBe('UPLOADED')
      file = await File.find(file.id)
      await file.updateStatus('CANCELLED')
      expect(file.status).toBe('CANCELLED')
    })
  })
})
