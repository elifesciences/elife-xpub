const mergeObjects = require('./mergeObjects')

describe('mergeObjects', () => {
  it('returns a merged copy of two objects without mutating source', () => {
    const objectA = { A: 'A' }
    const objectB = { B: 'B' }
    expect(mergeObjects(objectA, objectB)).toEqual({ A: 'A', B: 'B' })
    expect(objectA).toEqual({ A: 'A' })
    expect(objectB).toEqual({ B: 'B' })
  })

  it('merges multiple objects without mutating source', () => {
    const objectA = { A: 'A' }
    const objectB = { B: 'B' }
    const objectC = { C: 'C' }
    expect(mergeObjects(objectA, objectB, objectC)).toEqual({
      A: 'A',
      B: 'B',
      C: 'C',
    })
    expect(objectA).toEqual({ A: 'A' })
    expect(objectB).toEqual({ B: 'B' })
    expect(objectC).toEqual({ C: 'C' })
  })

  it('merges nested objects', () => {
    const objectA = { foo: { A: 'A' } }
    const objectB = { foo: { B: 'B' } }
    expect(mergeObjects(objectA, objectB)).toEqual({ foo: { A: 'A', B: 'B' } })
  })

  it('replaces source array values with input array', () => {
    const objectA = { A: ['a'] }
    const objectB = { A: ['b'] }
    expect(mergeObjects(objectA, objectB).A).toEqual(['b'])
  })
  it('merges objects by priority of order passed', () => {
    const objectA = { A: 'A' }
    const objectB = { A: 'B' }
    const objectC = { A: 'C' }
    expect(mergeObjects(objectA, objectB)).toEqual({ A: 'B' })
    expect(mergeObjects(objectA, objectB, objectC)).toEqual({ A: 'C' })
  })
})
