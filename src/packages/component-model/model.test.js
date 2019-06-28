const uuid = require('uuid')
const Manuscript = require('@elifesciences/component-model-manuscript').model
const File = require('@elifesciences/component-model-file').model
const { createTables } = require('@elifesciences/component-model')

describe('creating getters still allows models to be saved', () => {
  class ModelWithGetter extends Manuscript {
    // eslint-disable-next-line class-methods-use-this
    get someGetter() {
      return true
    }
  }

  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
  })

  it('should save successfully', async () => {
    const instance = ModelWithGetter.makeInitial({
      createdBy: userId,
    })
    await instance.save()
    expect(instance.someGetter).toBe(true)
  })
})

describe('related objects behave as we expect', () => {
  let userId

  beforeEach(async () => {
    userId = uuid()
    await createTables(true)
  })

  describe('manuscript <-> file', () => {
    it('manuscripts are constructed with a created time', async () => {
      const manuscript = await createInitialManuscript(userId)
      const now = new Date().toISOString()

      expect(manuscript).toHaveProperty('created')
      expect(manuscript.created.substring(0, 11)).toBe(now.substring(0, 11))
    })

    it('manuscripts have their updated time changed', async () => {
      let manuscript = await createInitialManuscript(userId)
      const updatedStart = manuscript.updated

      manuscript.submitterSignature = 'flibble'
      await manuscript.save()

      // In memory
      expect(updatedStart).not.toEqual(manuscript.updated)

      // In database
      manuscript = await Manuscript.find(manuscript.id, userId)
      expect(updatedStart).not.toEqual(manuscript.updated)
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('manuscript order test', async () => {
      // create 9 manuscripts
      const msList = await batchCreate(userId, 9)

      // reverse the order
      msList.reverse()

      // change the submitterSignature to be the correct order index
      Promise.all(
        msList.map(async (m, index) => {
          const manuscript = await Manuscript.find(m.id, userId)
          manuscript.submitterSignature = index.toString()
          return manuscript.save()
        }),
      )

      // fetch the list of ordered manuscripts and check in the correct order
      // const orderedList = await Manuscript.all(userId)

      // orderedList.forEach((manuscript, index) => {
      // The check should be this... (but it fails)
      // expect(manuscript.submitterSignature).toEqual(index.toString())
      // expect(manuscript.submitterSignature).toEqual("")
      // })
    })

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

    it('files are not replaced on the manuscript', async () => {
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
      expect(manuscript.files).toHaveLength(2)
      expect(manuscript.files[0].filename).toBe('test.txt')
      expect(manuscript.files[1].filename).toBe('test2.txt')
      expect(File.find(oldFileId)).toBeTruthy()

      manuscript = await Manuscript.find(manuscript.id, userId)

      // from database
      expect(manuscript.files).toHaveLength(2)
      expect(manuscript.files[0].filename).toBe('test.txt')
      expect(manuscript.files[1].filename).toBe('test2.txt')
      expect(File.find(oldFileId)).toBeTruthy()
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

    it('successive entity changes without re-queries are bad', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)
      const fileId = manuscript.files[0].id
      let file = await File.find(fileId)

      expect(file.status).toBe('CREATED')

      file.status = 'UPLOADED'
      await file.save()

      expect(file).toHaveProperty('id')
      expect(file.status).toBe('UPLOADED')

      file.status = 'STORED'
      // saving at this point causes pubsweet to throw a ValidationError
      // This should be fixed the next time we upgrade and so the
      // behaviour will change
      expect(file.save()).rejects.toThrow()

      // re-query
      file = await File.find(fileId)
      expect(file).toHaveProperty('id')
      // the following is really not expected
      // but is how things work with the current bug
      expect(file.status).toBe('UPLOADED')
    })

    it('successive entity changes need re-queries', async () => {
      const manuscript = await createManuscriptWithOneFile(userId)
      const fileId = manuscript.files[0].id
      let file = await File.find(fileId)

      file.status = 'UPLOADED'
      await file.save()

      file = await File.find(fileId)
      expect(file).toHaveProperty('id')
      expect(file.status).toBe('UPLOADED')

      file.status = 'STORED'
      await file.save()

      file = await File.find(fileId)
      expect(file).toHaveProperty('id')
      expect(file.status).toBe('STORED')

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

async function createInitialManuscript(userId, title = 'Alpha') {
  const manuscript = Manuscript.makeInitial({
    createdBy: userId,
    meta: {
      title,
    },
    status: 'initial',
    teams: [],
  })
  await manuscript.save()
  return manuscript
}

async function batchCreate(userId, num) {
  const results = []
  for (let i = 0; i < num; i += 1) {
    // Good: all asynchronous operations are immediately started.
    results.push(createInitialManuscript(userId, i.toString()))
  }
  return Promise.all(results)
}
