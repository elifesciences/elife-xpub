const uuid = require('uuid')
const dataAccess = require('./data-access')
const { createTables } = require('@pubsweet/db-manager')
const TeamManager = require('./index')

let testId = 0

async function createATeam(roleName) {
  const team = TeamManager.new()

  team.teamMembers.push({
    meta: {
      name: 'bob',
      email: 'bob@here.com',
    },
  })
  team.role = roleName
  team.objectId = uuid.v4()
  team.objectType = 'nothingness'
  return dataAccess.insert(team)
}

const initializeDatabase = async () => {
  await createTables(true)
  testId = await createATeam('testTeam')
  console.log('Created testId', testId)

  return testId
}

describe('TeamAccessLayer', () => {
  beforeEach(async () => {
    testId = await initializeDatabase()
  })

  it('initializes the db', async () => {
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
  })

  it('updates are persisted', async () => {
    const result = await dataAccess.selectById(testId)
    expect(result.id).toBe(testId)
    expect(result.teamMembers).toHaveLength(1)
    expect(result.role).toBe('testTeam')

    result.teamMembers = []
    result.role = 'changed'

    await dataAccess.update(result)
    const updated = await dataAccess.selectById(testId)

    expect(updated.id).toBe(testId)
    expect(updated.teamMembers).toHaveLength(0)
    expect(updated.role).toBe('changed')
  })

  it('selectAll', async () => {
    let result = await dataAccess.selectAll()
    expect(result).toHaveLength(1)

    const created = [
      await createATeam('team1'),
      await createATeam('team2'),
      await createATeam('team3'),
    ]

    result = await dataAccess.selectAll()
    expect(result).toHaveLength(4)
    const selected = new Set(result.map(team => team.id))

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
