const { createTables } = require('@pubsweet/db-manager')
const { SupportingFiles } = require('@elifesciences/xpub-controller')
const { User, Manuscript } = require('@elifesciences/xpub-model')
const { userData } = require('./index.test.data')

const dummyStorage = {
  getContent: async () => {},
  putContent: async () => {},
  deleteContent: async () => ({
    promise: Promise.resolve(true),
  }),
}

const expectRemoveSupportingFilesDoesNothing = async (manuscriptIn, userId) => {
  let manuscript = await manuscriptIn.save()
  manuscript = await Manuscript.find(manuscript.id, userId)
  const files = new SupportingFiles(dummyStorage, manuscript.id, userId)
  const mutatedManuscript = await files.removeAll()
  const strManuscript = JSON.stringify(manuscript, null, 4)
  const strMutated = JSON.stringify(mutatedManuscript, null, 4)
  expect(strManuscript).toEqual(strMutated)
}

const expectRemoveSupportingFilesLeavesManuscript = async (
  fileList,
  userId,
) => {
  let manuscript = new Manuscript({
    createdBy: userId,
    files: fileList,
  })
  manuscript = await manuscript.save()
  manuscript = await Manuscript.find(manuscript.id, userId)
  expect(manuscript.files).toHaveLength(fileList.length)
  const files = new SupportingFiles(dummyStorage, manuscript.id, userId)
  const mutatedManuscript = await files.removeAll()
  expect(mutatedManuscript.files).toHaveLength(1)
  expect(mutatedManuscript.files[0].type).toBe('MANUSCRIPT_SOURCE')
}

describe('Manuscripts', () => {
  let userId
  beforeEach(async () => {
    await createTables(true)
    const user = new User(userData)
    await user.save()
    userId = user.id
  })

  describe('removeSupportingFiles', () => {
    it('removes supporting files', async () => {
      const fakeManuscript = {
        filename: 'manuscript.pdf',
        type: 'MANUSCRIPT_SOURCE',
        url: 'manuscript/',
      }

      const fakeSupport = {
        filename: 'support.pdf',
        type: 'SUPPORTING_FILE',
        url: 'supporting/',
      }

      let manuscript = new Manuscript({
        createdBy: userId,
        files: [fakeSupport, fakeSupport, fakeManuscript],
      })

      manuscript = await manuscript.save()
      manuscript = await Manuscript.find(manuscript.id, userId)
      expect(manuscript.files).toHaveLength(3)
      const files = new SupportingFiles(dummyStorage, manuscript.id, userId)
      const mutatedManuscript = await files.removeAll()
      expect(mutatedManuscript.files).toHaveLength(1)
    })

    it('does not change the manuscript when no files to remove', async () => {
      const manuscript = new Manuscript({ createdBy: userId, files: [] })

      await expectRemoveSupportingFilesDoesNothing(manuscript, userId)
    })

    it('does not remove the manuscript', async () => {
      const fakeManuscript = {
        filename: 'manuscript.pdf',
        type: 'MANUSCRIPT_SOURCE',
        url: 'manuscript/',
      }
      const manuscript = new Manuscript({
        createdBy: userId,
        files: [fakeManuscript],
      })
      await expectRemoveSupportingFilesDoesNothing(manuscript, userId)
    })

    it('does not remove the manuscript when supporting files present', async () => {
      const fakeManuscript = {
        filename: 'manuscript.pdf',
        type: 'MANUSCRIPT_SOURCE',
        url: 'manuscript/',
      }
      const fakeSupport = {
        filename: 'support.pdf',
        type: 'SUPPORTING_FILE',
        url: 'supporting/',
      }
      await expectRemoveSupportingFilesLeavesManuscript(
        [fakeManuscript, fakeSupport],
        userId,
      )

      await expectRemoveSupportingFilesLeavesManuscript(
        [fakeManuscript, fakeSupport, fakeSupport, fakeSupport],
        userId,
      )
    })
  })
})
