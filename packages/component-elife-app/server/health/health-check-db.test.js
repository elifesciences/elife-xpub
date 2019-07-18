const checkDb = require('./health-check-db')

describe('health-check-db', () => {
  it('empty response when ok', async () => {
    const from = jest.fn(table => [1, 2, 3])
    const db = {
      select: jest.fn(cols => ({ from })),
    }
    const response = await checkDb(db)
    expect(db.select).toHaveBeenCalled()
    expect(from).toHaveBeenCalled()
    expect(response).toBe('')
  })

  it('no tables response when empty', async () => {
    const from = jest.fn(table => [])
    const db = {
      select: jest.fn(cols => ({ from })),
    }

    const response = await checkDb(db)
    expect(db.select).toHaveBeenCalled()
    expect(from).toHaveBeenCalled()
    expect(response).toBe('no tables')
  })

  it('error message response when no connection', async () => {
    const db = {
      select: jest.fn(cols => {
        throw new Error('bad db')
      }),
    }
    const response = await checkDb(db)
    expect(response).toBe('bad db')
  })
})
