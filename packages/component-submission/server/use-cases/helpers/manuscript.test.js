const { createTables } = require('@elifesciences/component-model')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const ManuscriptHelper = require('./manuscript')

describe('clearPendingFile()', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const user = await User.createWithIdentity(profileId)
    userId = user.id
  })

  it('removes any file with type MANUSCRIPT_SOURCE_PENDING related to this manuscript', async () => {
    let manuscript = Manuscript.makeInitial({ createdBy: userId })
    const { id } = await manuscript.saveGraph()
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
    await fileEntity.saveGraph()
    const sourceFile = await fileEntity2.saveGraph()
    manuscript = await Manuscript.find(id, userId)
    expect(manuscript.files).toHaveLength(2)

    await ManuscriptHelper.clearPendingFile(manuscript)
    manuscript = await Manuscript.find(id, userId)

    expect(manuscript.files).toHaveLength(1)
    expect(manuscript.files[0].id).toEqual(sourceFile.id)
    expect(manuscript.files[0].type).not.toEqual('MANUSCRIPT_SOURCE_PENDING')
  })
})
