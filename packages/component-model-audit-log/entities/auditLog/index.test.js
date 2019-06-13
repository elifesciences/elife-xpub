const { createTables } = require('@elifesciences/component-model')
const uuid = require('uuid')
const AuditLog = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

describe('AuditLog', () => {
  beforeEach(async () => {
    await createTables(true)
  })

  it('should save to the database', async () => {
    const audit = await new AuditLog({
      action: 'CREATED',
      objectId: uuid(),
      objectType: 'some-object.some-attribute',
      value: 'some-value',
    }).saveGraph()
    expect(audit.id).toBeTruthy()
  })

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
