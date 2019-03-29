const { createTables } = require('@pubsweet/db-manager')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript')
const ManuscriptController = require('./manuscript')
const { FilesHelper, ManuscriptHelper } = require('./helpers')

const createMockController = userId => {
  const config = { get: () => 0 }
  const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'

  // create instance of controller with mock params
  return new ManuscriptController(
    config,
    userId,
    {},
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
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
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

    const manuscript = new Manuscript({ createdBy: userId })
    const { id: manuscriptId } = await manuscript.save()

    expect.assertions(1)
    try {
      await manuscriptController.upload(manuscriptId, {}, 0)
    } catch (e) {
      expect(ManuscriptHelper.clearPendingFile).toBeCalled()
    }
  })
})
