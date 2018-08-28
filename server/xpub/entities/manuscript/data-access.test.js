require('pubsweet-server/src/db')
const emptyManuscript = require('./helpers/empty')
const dataAccess = require('./data-access')
const { createTables } = require('@pubsweet/db-manager')

// const migrate = true
// dataAccess.config(migrate)
const initializeDatabase = async () => {
  await createTables(true)
  testId = await dataAccess.insert(emptyManuscript)
  console.log('Inserted: ', testId)
  return testId
}

const clearDatabase = () => {
  console.log('clear')
}
let testId = 0

describe('ManuscriptAccessLayer', () => {
  beforeEach(async () => {
    testId = await initializeDatabase()
  })

  afterEach(() => {
    clearDatabase()
  })

  // console.debug('Using database: ', dataAccess.db.options.database)
  it('initializes the db', async () => {
    console.log('Searching for: ', testId)
    const result = await dataAccess.selectById(testId)
    console.log('RESULT: ', JSON.stringify(result))
  })
})
