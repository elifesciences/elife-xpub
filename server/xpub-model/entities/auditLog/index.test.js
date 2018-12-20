const { createTables } = require('@pubsweet/db-manager')
const config = require('config')
const AuditLog = require('.')

describe('AuditLog', () => {
  beforeEach(() => createTables(true))

  describe('delete', () => {

    it('if should throw an unsupported error', async () => {
      const audit = new AuditLog()
      const error = new Error('Unsupported operation')
      let response
      try {
        response = await audit.delete()
      } catch (err) {
        response = err
      }
      expect(response).toEqual(error)
    })

  })
})

