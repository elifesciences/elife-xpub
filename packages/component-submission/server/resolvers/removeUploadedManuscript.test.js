const { createTables } = require('@pubsweet/db-manager')
const User = require('@elifesciences/component-model-user')
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { Mutation } = require('.')
const { userData } = require('./index.test.data')

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  let userId
  beforeEach(async () => {
    await createTables(true)
    const user = new User(userData)
    await user.save()
    userId = user.id
  })

  describe('removeUploadedManuscript', () => {
    it('returns the original Manuscript when there is no file to remove', async () => {
      const manuscript = new Manuscript({ createdBy: userId, files: [] })
      const { id } = await manuscript.save()
      const mutatedManuscript = await Mutation.removeUploadedManuscript(
        {},
        { id },
        { user: profileId },
      )
      expect(mutatedManuscript.id).toEqual(manuscript.id)
    })

    it('removes the manuscript file when there is one', async () => {
      const fakeFile = {
        filename: 'manuscript.pdf',
        type: 'MANUSCRIPT_SOURCE',
        url: 'manuscript/',
      }
      const manuscript = new Manuscript({
        createdBy: userId,
        files: [fakeFile],
      })
      const { id } = await manuscript.save()
      expect(manuscript.files).toHaveLength(1)
      await Mutation.removeUploadedManuscript({}, { id }, { user: profileId })
      const mutatedManuscript = await Manuscript.find(id, userId)
      expect(mutatedManuscript.files).toHaveLength(0)
    })
  })
})
