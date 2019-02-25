const { createTables } = require('@pubsweet/db-manager')
const { User, Manuscript, File } = require('@elifesciences/xpub-model')
const ManuscriptHelper = require('./manuscript')

describe('clearPendingFile()', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
    userId = user.id
  })

  it('removes any file with type MANUSCRIPT_SOURCE_PENDING related to this manuscript', async () => {
    let manuscript = new Manuscript({ createdBy: userId })
    const { id } = await manuscript.save()
    const fileEntity = new File({
      manuscriptId: id,
      type: 'MANUSCRIPT_SOURCE_PENDING',
      filename: 'foo.jpg',
      url: '/',
    })
    const fileEntity2 = new File({
      manuscriptId: id,
      type: 'MANUSCRIPT_SOURCE',
      filename: 'bar.jpg',
      url: '/',
    })
    await fileEntity.save()
    await fileEntity2.save()
    manuscript = await Manuscript.find(id, userId)
    expect(manuscript.files).toHaveLength(2)

    await ManuscriptHelper.clearPendingFile(manuscript)
    manuscript = await Manuscript.find(id, userId)

    expect(manuscript.files).toHaveLength(1)
  })
})
