const { createTables } = require('@elifesciences/component-model')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const ManuscriptController = require('./manuscript')
const { FilesHelper, ManuscriptHelper } = require('./helpers')

const createMockController = (userId, storage) => {
  const config = { get: () => 0 }
  const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'

  const mockStorage = storage || {}

  // create instance of controller with mock params
  return new ManuscriptController(
    config,
    userId,
    mockStorage,
    {},
    {
      asyncIterators: { ON_UPLOAD_PROGRESS },
      getPubsub: () => ({ publish: () => {} }),
    },
  )
}
describe('upload', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const user = await User.createWithIdentity(profileId)
    userId = user.id
  })

  it('stops sending progress updates if error is thrown when uplaoding file', async () => {
    // Mock uneeded creation of file
    FilesHelper.getFileData = jest.fn()
    // Mock functions that use timers
    FilesHelper.startFileProgress = jest.fn()
    FilesHelper.endFileProgress = jest.fn()

    // create instance of controller with mock params
    const manuscriptController = createMockController(userId)

    // Mocks internally stored helper object.
    // Can be refactored as part of #1551
    manuscriptController.manuscriptHelper.uploadManuscriptFile = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          reject(new Error('Error'))
        }),
    )

    const manuscript = Manuscript.makeInitial({ createdBy: userId })
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
  it('Clears any pending files remaining if the uplaod process fails', async () => {
    ManuscriptHelper.clearPendingFile = jest.fn()
    // create instance of controller with mock params
    const manuscriptController = createMockController(userId)

    // Mocks internally stored helper object.
    // Can be refactored as part of #1551
    manuscriptController.manuscriptHelper.uploadManuscriptFile = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          reject(new Error('Error'))
        }),
    )

    const manuscript = Manuscript.makeInitial({ createdBy: userId })
    const { id: manuscriptId } = await manuscript.save()

    expect.assertions(1)
    try {
      await manuscriptController.upload(manuscriptId, {}, 0)
    } catch (e) {
      expect(ManuscriptHelper.clearPendingFile).toBeCalled()
    }
  })
})

describe('find', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
    userId = user.id
  })

  it('Populates files download link', async () => {
    const manuscriptController = createMockController(userId, {
      getDownloadLink: () => 'http://example.com/download-link',
    })
    const manuscript = Manuscript.makeInitial({ createdBy: userId })
    const { id: manuscriptId } = await manuscript.save()
    const file = new File({
      manuscriptId,
      filename: 'thisfile.txt',
      url: '/an/url',
    })

    await file.save()
    const foundManuscript = await manuscriptController.getView(manuscriptId)

    expect(foundManuscript.files[0].downloadLink).toEqual(
      'http://example.com/download-link',
    )
  })
})
