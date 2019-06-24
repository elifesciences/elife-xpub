import flattenObject from './flattenObject'

describe('flattenObject', () => {
  it('returns empty object when passed empty object', () => {
    expect(flattenObject({})).toEqual({})
  })
  it('returns a flat object when passed a flat object', () => {
    expect(flattenObject({ foo: 'bar' })).toEqual({ foo: 'bar' })
  })
  it('flattens arrays down to flat values', () => {
    expect(flattenObject({ foo: [1, 2, 3] })).toEqual({
      'foo.0': 1,
      'foo.1': 2,
      'foo.2': 3,
    })
  })
  it('flattens objects down to flat values', () => {
    expect(flattenObject({ foo: { bar: 1 } })).toEqual({ 'foo.bar': 1 })
  })
  it('recursivly flattens nested values', () => {
    expect(
      flattenObject({ foo1: { foo2: { foo3: [1, 2] }, bar1: [{ bar2: 3 }] } }),
    ).toEqual({
      'foo1.foo2.foo3.0': 1,
      'foo1.foo2.foo3.1': 2,
      'foo1.bar1.0.bar2': 3,
    })
  })
})
