const { createTables } = require('@elifesciences/component-model')
const AuditLog = require('@elifesciences/component-model-audit-log').model
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model

const { SupportingFiles } = require('../use-cases')
const { userData } = require('./index.test.data')

const dummyStorage = {
  getContent: async () => {},
  putContent: async () => {},
  deleteContent: async () => ({
    promise: Promise.resolve(true),
  }),
  getDownloadLink: jest.fn(),
}

const expectRemoveSupportingFilesDoesNothing = async (manuscriptIn, userId) => {
  let manuscript = await manuscriptIn.saveGraph()
  manuscript = await Manuscript.find(manuscript.id, userId)
  const files = new SupportingFiles(dummyStorage, manuscript.id, userId)
  const mutatedManuscript = await files.removeAll()
  expect(manuscript.toJSON()).toEqual(mutatedManuscript.toJSON())
}

const expectRemoveSupportingFilesLeavesManuscript = async (
  fileList,
  userId,
) => {
  let manuscript = Manuscript.makeInitial({
    createdBy: userId,
    files: fileList,
  })
  manuscript = await manuscript.saveGraph()
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
    await user.saveGraph()
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

      let manuscript = Manuscript.makeInitial({
        createdBy: userId,
        files: [fakeSupport, fakeSupport, fakeManuscript],
      })

      manuscript = await manuscript.saveGraph()
      manuscript = await Manuscript.find(manuscript.id, userId)
      expect(manuscript.files).toHaveLength(3)
      const files = new SupportingFiles(dummyStorage, manuscript.id, userId)
      const mutatedManuscript = await files.removeAll()
      expect(mutatedManuscript.files).toHaveLength(1)

      const audits = await AuditLog.all()
      expect(audits).toHaveLength(3)
      expect(audits[1].value).toBe('CANCELLED')
      expect(audits[2].value).toBe('CANCELLED')
      expect(
        audits
          .slice(1)
          .map(audit => audit.objectId)
          .sort(),
      ).toEqual([manuscript.files[0].id, manuscript.files[1].id].sort())
    })

    it('does not change the manuscript when no files to remove', async () => {
      const manuscript = Manuscript.makeInitial({
        createdBy: userId,
        files: [],
      })

      await expectRemoveSupportingFilesDoesNothing(manuscript, userId)
    })

    it('does not remove the manuscript', async () => {
      const fakeManuscript = {
        filename: 'manuscript.pdf',
        type: 'MANUSCRIPT_SOURCE',
        url: 'manuscript/',
      }
      const manuscript = Manuscript.makeInitial({
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
