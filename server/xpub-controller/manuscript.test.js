const { createTables } = require('@pubsweet/db-manager')
const User = require('../xpub-model/entities/user')
const Manuscript = require('../xpub-model/entities/manuscript')
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
    jest.useFakeTimers()
    // Mock depenencies
    FilesHelper.generateFileEntity = jest.fn()
    const config = { get: () => 0 }
    const publishMock = jest.fn()
    const ON_UPLOAD_PROGRESS = 'ON_UPLOAD_PROGRESS'

    // create instance of controller with mock params
    const manuscriptController = new ManuscriptController(
      config,
      userId,
      {},
      {},
      {
        asyncIterators: { ON_UPLOAD_PROGRESS },
        getPubsub: () => ({ publish: publishMock }),
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

    // https://jestjs.io/docs/en/tutorial-async#error-handling
    expect.assertions(4)
    try {
      await manuscriptController.upload(manuscriptId, {}, 0)
    } catch (e) {
      expect(e).toEqual(new Error('Error'))
      expect(
        manuscriptController.manuscriptHelper.uploadManuscriptFile,
      ).toBeCalledTimes(1)
      expect(clearInterval).toHaveBeenCalledTimes(1)
      expect(publishMock).toHaveBeenLastCalledWith(
        `${ON_UPLOAD_PROGRESS}.${manuscriptId}`,
        { manuscriptUploadProgress: 100 },
      )
    }
  })
})
