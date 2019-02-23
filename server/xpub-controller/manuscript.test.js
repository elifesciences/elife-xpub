const { createTables } = require('@pubsweet/db-manager')
const User = require('../xpub-model/entities/user')
const Manuscript = require('../xpub-model/entities/manuscript')
const File = require('../xpub-model/entities/file')
const ManuscriptController = require('./manuscript')
const { FilesHelper } = require('./helpers')

describe('upload', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
    userId = user.id
  })

  it('stops sending progress updates if error is thrown when uplaoding file', async () => {
    // Mock uneeded creation of file
    FilesHelper.generateFileEntity = jest.fn()

    // Mock functions that use timers
    FilesHelper.startFileProgress = jest.fn()
    FilesHelper.endFileProgress = jest.fn()

    const config = { get: () => 0 }
    const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'

    // create instance of controller with mock params
    const manuscriptController = new ManuscriptController(
      config,
      userId,
      {},
      {},
      {
        asyncIterators: { ON_UPLOAD_PROGRESS },
        getPubsub: () => ({ publish: () => {} }),
      },
    )

    // Mocks internally stored helper object.
    // Can be refactored as part of #1551
    manuscriptController.manuscriptHelper.uploadManuscriptFile = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          reject(new Error('Error'))
        }),
    )

    const manuscript = new Manuscript({ createdBy: userId })
    const { id: manuscriptId } = await manuscript.save()

    expect.assertions(3)
    try {
      await manuscriptController.upload(manuscriptId, {}, 0)
    } catch (e) {
      expect(e).toEqual(new Error('Error'))
      expect(
        manuscriptController.manuscriptHelper.uploadManuscriptFile,
      ).toBeCalledTimes(1)
      expect(FilesHelper.endFileProgress).toBeCalled()
    }
  })
})

describe('clearPendingFile', () => {
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

    await ManuscriptController.clearPendingFile(manuscript)
    manuscript = await Manuscript.find(id, userId)

    expect(manuscript.files).toHaveLength(1)
  })
})
