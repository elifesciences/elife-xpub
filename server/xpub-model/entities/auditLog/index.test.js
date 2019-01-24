const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const User = require('../user')
const AuditLog = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

describe('AuditLog', () => {
  let user

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    user = await User.findOrCreate(profileId)
  })

  it('should save to the database', async () => {
    const audit = await new AuditLog({
      userId: user.id,
      action: 'CREATED',
      objectId: uuid(),
      objectType: 'some-object.some-attribute',
      value: 'some-value'
    }).save()
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

