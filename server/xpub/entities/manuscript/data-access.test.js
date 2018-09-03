const dataAccess = require('./data-access')
const { createTables } = require('@pubsweet/db-manager')
const testData = require('./data-access.test.data')

let testId = 0
let initializing = false

const initializeDatabase = async () => {
  initializing = true
  await createTables(true)

  testId = await testData.initialize(dataAccess)
  console.log('Created testId', testId)

  initializing = false
  return testId
}

const clearDatabase = async () => {
  await dataAccess.delete(testId)
}

describe('ManuscriptAccessLayer', () => {
  beforeEach(async () => {
    testId = await initializeDatabase()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  it('initializes the db', async () => {
    expect(initializing).toBeFalsy()
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
  })

  async function callSelectManuscript() {
    await dataAccess.selectById(testId)
  }

  it('deletes a manuscript', async () => {
    expect(initializing).toBeFalsy()
    const result = await dataAccess.delete(testId)
    expect(result.command).toBe('DELETE')
    expect(result.rowCount).toBe(1)

    const error = new Error('Manuscript not found')
    expect(callSelectManuscript()).rejects.toEqual(error)
  })

  it('inserts a manuscript', async () => {
    expect(initializing).toBeFalsy()
    const manu = testData.getBlankManuscript()
    manu.meta.title = 'new one'
    manu.createdBy = 'me'

    const newId = await dataAccess.insert(manu)
    const retrieved = await dataAccess.selectById(newId)

    expect(retrieved.meta.title).toBe('new one')
    expect(retrieved.createdBy).toBe('me')
  })

  it('updates a manuscript', async () => {
    expect(initializing).toBeFalsy()
    const manu = await dataAccess.selectById(testId)
    manu.meta.title = 'changed'

    let result = await dataAccess.update(manu)
    expect(result.command).toBe('UPDATE')
    expect(result.rowCount).toBe(1)

    result = await dataAccess.selectById(testId)
    expect(result.meta.title).toBe('changed')
  })

  it('selects all manuscripts', async () => {
    expect(initializing).toBeFalsy()

    const MAX = 100
    const added = await testData.addManuscripts(dataAccess, 100)

    added.push(testId)
    expect(added).toHaveLength(MAX + 1)
    const returned = await dataAccess.selectAll()
    expect(returned).toHaveLength(MAX + 1)
    expect(returned).toHaveLength(added.length)

    const selected = new Set(returned.map(manu => manu.id))

    const difference = added.filter(member => !selected.has(member))
    expect(difference).toHaveLength(0)
  })

  it('selects by status', async () => {
    expect(initializing).toBeFalsy()
    const added = await testData.addManuscripts(dataAccess, 10)

    // get even indexes
    const markedTest = added.filter((id, index) => index % 2)

    // mark as Test
    await Promise.all(
      markedTest.map(async id => {
        const result = await dataAccess.selectById(id)
        expect(result.id).toBe(id)

        result.status = 'TEST'
        const ret = await dataAccess.update(result)
        expect(ret.rowCount).toBe(1)
      }),
    )
    // Now get all TEST statuses from the database
    const selected = await dataAccess.selectByStatus('TEST', 'me')
    expect(selected).toHaveLength(markedTest.length)

    await Promise.all(selected.map(manu => expect(manu.status).toBe('TEST')))

    const selectedSet = new Set(selected.map(manu => manu.id))
    const difference = markedTest.filter(member => !selectedSet.has(member))
    expect(difference).toHaveLength(0)
  })
})
