const { createTables } = require('@pubsweet/db-manager')
const db = require('@pubsweet/db-manager/src/db')
const splitter = require('./nameSplitter')

const existingNames = [
  { id: 1, first: 'J. Richard', last: 'Jones' },
  { id: 2, first: 'Maria Inês', last: 'Birkegård' },
]

describe('Name splitter', () => {
  beforeAll(async () => {
    await createTables(true)
    await db.table('ejp_name').insert(existingNames)
  })

  it('handles single word', async () => {
    const surname = await splitter('Wrong')
    expect(surname).toEqual('Wrong')
  })

  it('handles empty string', async () => {
    const surname = await splitter('')
    expect(surname).toEqual('')
  })

  it('splits known multipart forename', async () => {
    const surname = await splitter('J. Richard Jones')
    expect(surname).toEqual('Jones')
  })

  it('splits known multipart forename with special chars', async () => {
    const surname = await splitter('Maria Inês Birkegård')
    expect(surname).toEqual('Birkegård')
  })

  it('known surnames are case insensitive', async () => {
    const surname = await splitter('maria INÊS birkegård')
    expect(surname).toEqual('Birkegård')
  })

  it('splits unknown name on first space', async () => {
    const surname = await splitter('Genevieve Abdel Rahman')
    expect(surname).toEqual('Abdel Rahman')
  })
})
