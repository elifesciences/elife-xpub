const dataAccess = require('./data-access')
const manuscriptTestData = require('../manuscript/data-access.test.data')
const { createTables } = require('@pubsweet/db-manager')
const FileManager = require('./index')

let testId = 0
let manuscriptId = 0

async function createAFile(mid, fileName) {
  const f = FileManager.new()
  f.manuscriptId = mid
  f.filename = fileName
  return dataAccess.insert(f)
}

const initializeDatabase = async () => {
  await createTables(true)
  manuscriptId = await manuscriptTestData.createSingleManuscript()
  testId = await createAFile(manuscriptId, 'testFile')
  console.log('Created testId', testId)
}

describe('FileAccessLayer', () => {
  beforeEach(async () => {
    await initializeDatabase()
  })

  it('initializes the db', async () => {
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
  })

  it('updates are persisted', async () => {
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
    expect(result.filename).toBe('testFile')

    result.filename = 'changed'
    await dataAccess.update(result)

    const updated = await dataAccess.selectById(testId)

    expect(updated.id).toBe(testId)
    expect(updated.filename).toBe('changed')
  })

  it('selectAll', async () => {
    let result = await dataAccess.selectAll()
    expect(result).toHaveLength(1)

    const created = [
      await createAFile(manuscriptId, 'file1'),
      await createAFile(manuscriptId, 'file2'),
      await createAFile(manuscriptId, 'file3'),
    ]

    result = await dataAccess.selectAll()
    expect(result).toHaveLength(4)
    const selected = new Set(result.map(f => f.id))

    const difference = created.filter(member => !selected.has(member))
    expect(difference).toHaveLength(0)
  })

  it('delete', async () => {
    let result = await dataAccess.selectAll()
    expect(result).toHaveLength(1)

    await dataAccess.delete(testId)

    result = await dataAccess.selectAll()
    expect(result).toHaveLength(0)
  })
})
