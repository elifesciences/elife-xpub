const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const Manuscript = require('./entities/manuscript')
const File = require('./entities/file')

describe('related objects behave as we expect', () => {
  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
  })

  describe('manuscript <-> file', () => {
    it('is initialised without any files', async () => {
      const manuscript = await createInitialManuscript(userId)
      const files = await File.all()

      expect(manuscript).toHaveProperty('files')
      expect(manuscript.files).toHaveLength(0)
      expect(files).toHaveLength(0)
    })

    it('file updates are reflected on the manuscript', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)

      expect(await File.all()).toHaveLength(1)
      expect(manuscript).toHaveProperty('files')
      expect(manuscript.files).toHaveLength(1)
    })

    it('file property updates are reflected on the manuscript', async () => {
      let manuscript = await createManuscriptWithOneFile(userId)

      const file = await File.find(manuscript.files[0].id)
      file.type = 'updated'
      await file.save()

      manuscript = await Manuscript.find(manuscript.id, userId)

      expect(file.type).toBe('updated')
      expect(manuscript.files[0].type).toBe('updated')
    })

    it('manuscript property updates are reflected on the file', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)

      manuscript.files[0].type = 'updated'
      await manuscript.save()
      const file = await File.find(manuscript.files[0].id)

      expect(file.type).toBe('updated')
      expect(manuscript.files[0].type).toBe('updated')
    })

    it('files are replaced on the manuscript', async () => {
      let manuscript = await createManuscriptWithOneFile(userId)
      const oldFileId = manuscript.files[0].id
      const file = new File({
        manuscriptId: manuscript.id,
        filename: 'test2.txt',
        url: '-',
        type: 'test2_file',
      })
      manuscript.files[0] = file
      await manuscript.save()

      // in memory
      expect(manuscript.files).toHaveLength(1)
      expect(manuscript.files[0].filename).toBe('test2.txt')
      expect(File.find(oldFileId)).rejects.toThrow()

      manuscript = await Manuscript.find(manuscript.id, userId)

      // from database
      expect(manuscript.files).toHaveLength(1)
      expect(manuscript.files[0].filename).toBe('test2.txt')
      expect(File.find(oldFileId)).rejects.toThrow()
    })

    it('mutates the manuscript when save() is called', async () => {
      let manuscript = await createManuscriptWithOneFile(userId)
      manuscript.meta.title = 'changed'
      await manuscript.save()
      // in memory
      expect(manuscript).toHaveProperty('id')
      expect(manuscript.meta.title).toBe('changed')
      manuscript = await Manuscript.find(manuscript.id, userId)
      // from database
      expect(manuscript).toHaveProperty('id')
      expect(manuscript.meta.title).toBe('changed')
    })

    it('file changes are reflected on the manuscript', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)
      const file = await File.find(manuscript.files[0].id)
      file.status = 'UPLOADED'
      await file.save()

      // in memory
      expect(file).toHaveProperty('id')
      expect(file.status).toBe('UPLOADED')

      file.status = 'STORED'
      await file.save()

      // in memory
      expect(file).toHaveProperty('id')
      expect(file.status).toBe('STORED')

      const f = await File.find(manuscript.files[0].id)
      expect(f.status).toBe('STORED')

      // find the manuscript and check its updated via there...
      const m = await Manuscript.find(manuscript.id, userId)
      expect(m.files[0].status).toBe('STORED')
    })

    it('mutates the file when save() is called', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)
      const file = await File.find(manuscript.files[0].id)
      file.status = 'UPLOADED'
      await file.save()

      // in memory
      expect(file).toHaveProperty('id')
      expect(file.status).toBe('UPLOADED')

      // from database
      let dbFile = await File.find(manuscript.files[0].id)
      // once we query for the file again we cannot use the older 'file'
      // if we do it won't apply changes to the db
      expect(dbFile).toHaveProperty('id')
      expect(dbFile.status).toBe('UPLOADED')

      dbFile.status = 'STORED'
      await dbFile.save()

      // in memory
      expect(dbFile).toHaveProperty('id')
      expect(dbFile.status).toBe('STORED')

      // from database
      dbFile = await File.find(manuscript.files[0].id)
      expect(dbFile).toHaveProperty('id')
      expect(dbFile.status).toBe('STORED')

      // find the manuscript and check its updated via there...
      const m = await Manuscript.find(manuscript.id, userId)
      expect(m.files[0].status).toBe('STORED')
    })

    it('puts id on a new file', async () => {
      const manuscript = await createInitialManuscript(userId)
      const { id } = manuscript

      const fileEntity = new File({
        manuscriptId: id,
        url: `manuscripts/${id}`,
        filename: 'text.txt',
        type: 'MANUSCRIPT_SOURCE_PENDING',
        mimeType: 'application/txt',
      })
      await fileEntity.save()
      expect(fileEntity).toHaveProperty('id')
    })
  })
})

async function createManuscriptWithOneFile(userId) {
  let manuscript = await createInitialManuscript(userId)
  const file = new File({
    manuscriptId: manuscript.id,
    filename: 'test.txt',
    url: '-',
    type: 'test_file',
  })
  await file.save()
  manuscript = await Manuscript.find(manuscript.id, userId)
  return manuscript
}

async function createInitialManuscript(userId) {
  const manuscript = new Manuscript({
    createdBy: userId,
    meta: {
      title: 'Alpha',
    },
    status: 'initial',
    teams: [],
  })
  await manuscript.save()
  return manuscript
}
