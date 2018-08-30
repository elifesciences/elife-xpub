const emptyManuscript = require('./helpers/empty')
const dataAccess = require('./data-access')
const { createTables } = require('@pubsweet/db-manager')

let testId = 0
let initializing = false

const initializeDatabase = async () => {
  initializing = true
  await createTables(true)

  testId = await dataAccess.insert(emptyManuscript)
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

  afterEach(() => {
    clearDatabase()
  })

  it('initializes the db correctly', async () => {
    expect(initializing).toBeFalsy()
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
  })
})
