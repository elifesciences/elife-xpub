const dataAccess = require('./data-access')
const { createTables } = require('@pubsweet/db-manager')
const testData = require('./data-access.test.data')
const Manuscript = require('./index')

let testId = 0

const initializeDatabase = async () => {
  await createTables(true)

  testId = await testData.createSingleManuscript()
}

describe('ManuscriptAccessLayer', () => {
  beforeEach(async () => {
    await initializeDatabase()
  })

  it('initializes the db', async () => {
    const result = await dataAccess.selectById(testId, 'me')
    expect(result.id).toBe(testId)
  })

  async function callSelectManuscript() {
    await dataAccess.selectById(testId, 'me')
  }

  it('deletes a manuscript', async () => {
    const result = await dataAccess.delete(testId)
    expect(result.command).toBe('DELETE')
    expect(result.rowCount).toBe(1)

    const error = new Error('Manuscript not found')
    expect(callSelectManuscript()).rejects.toEqual(error)
  })

  it('inserts a manuscript', async () => {
    const manu = Manuscript.new()
    manu.meta.title = 'new one'
    manu.createdBy = 'me'

    const newId = await dataAccess.insert(manu)
    const retrieved = await dataAccess.selectById(newId, 'me')

    expect(retrieved.meta.title).toBe('new one')
    expect(retrieved.createdBy).toBe('me')
  })

  it('updates a manuscript', async () => {
    const manu = await dataAccess.selectById(testId, 'me')
    manu.meta.title = 'changed'

    let result = await dataAccess.update(manu)
    expect(result.command).toBe('UPDATE')
    expect(result.rowCount).toBe(1)

    result = await dataAccess.selectById(testId, 'me')
    expect(result.meta.title).toBe('changed')
  })

  it('selects all manuscripts', async () => {
    const MAX = 100
    const added = await testData.addManuscripts(100)

    added.push(testId)
    expect(added).toHaveLength(MAX + 1)
    const returned = await dataAccess.selectAll('me')
    expect(returned).toHaveLength(MAX + 1)
    expect(returned).toHaveLength(added.length)

    const selected = new Set(returned.map(manu => manu.id))

    const difference = added.filter(member => !selected.has(member))
    expect(difference).toHaveLength(0)
  })

  it('selects by status', async () => {
    const added = await testData.addManuscripts(10)

    // get even indexes
    const markedTest = added.filter((id, index) => index % 2)

    // mark as Test
    await Promise.all(
      markedTest.map(async id => {
        const result = await dataAccess.selectById(id, 'me')
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
