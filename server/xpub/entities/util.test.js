const { rowToEntity, entityToRow } = require('./util')

const testData = [
  [
    { id: '1', foo: 'hey', bar_baz: 'ho' },
    { id: '1', foo: 'hey', barBaz: 'ho' },
  ],
  [
    {
      id: '1',
      'foo,bar': 'hey',
      'foo,baz': 'ho',
      'oof_rab,boo_far_roo': "let's go",
    },
    {
      id: '1',
      foo: { bar: 'hey', baz: 'ho' },
      oofRab: { booFarRoo: "let's go" },
    },
  ],
  [{ json_value: { some: 'data' } }, { jsonValue: { some: 'data' } }],
]

describe('rowToEntity', () => {
  test.each(testData)('maps row to entity', (row, entity) => {
    expect(rowToEntity(row)).toEqual(entity)
  })
})

describe('entityToRow', () => {
  test.each(testData)('maps entity to row', (row, entity) => {
    expect(entityToRow(entity, Object.keys(row))).toEqual(row)
  })
})
