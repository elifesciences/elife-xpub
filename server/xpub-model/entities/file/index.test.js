const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const File = require('.')
const Manuscript = require('../manuscript')

describe('File', () => {
  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
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
    it('should be initialised in the CREATED state', async () => {
      const manuscript = await new Manuscript({
        createdBy: userId,
      }).save()
      const file = await new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      }).save()
      expect(file.status).toBe('CREATED')
    })
    it('sets file status to value passed', async () => {
      const manuscript = await new Manuscript({
        createdBy: userId,
      }).save()
      let file = await new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      }).save()
      expect(file.status).toBe('CREATED')
      file = await File.find(file.id)
      await file.updateStatus('UPLOADED', userId)
      expect(file.status).toBe('UPLOADED')
      file = await File.find(file.id)
      await file.updateStatus('CANCELLED', userId)
      expect(file.status).toBe('CANCELLED')
    })
  })

  describe('save()', () => {
    it('calls validate() on related manuscript', async () => {
      const manuscript = await new Manuscript({
        createdBy: userId,
      }).save()
      expect(manuscript.fileStatus).toEqual('READY')
      const file = await new File({
        manuscriptId: manuscript.id,
        filename: 'thisfile.txt',
        url: '/an/url',
      }).save(userId)
      await manuscript.refresh()
      expect(file.status).toBe('CREATED')
      expect(manuscript.fileStatus).toEqual('CHANGING')
    })
  })
})
