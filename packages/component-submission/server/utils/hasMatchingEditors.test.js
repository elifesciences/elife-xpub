const hasMatchingEditors = require('./hasMatchingEditors')

describe('hasMatchingEditors', () => {
  const suggested = [
    { meta: { elifePersonId: 1 } },
    { meta: { elifePersionId: 2 } },
  ]

  const opposed = [
    { meta: { elifePersonId: 1 } },
    { meta: { elifePersionId: 3 } },
  ]

  it('returns true if matching editors', () => {
    expect(hasMatchingEditors(suggested, opposed)).toBe(true)
  })

  it('returns false if no matching editors', () => {
    expect(hasMatchingEditors([suggested[0]], [opposed[1]])).toBe(false)
  })

  it('returns false with empty arrays', () => {
    expect(hasMatchingEditors([], [])).toBe(false)
    expect(hasMatchingEditors(suggested, [])).toBe(false)
    expect(hasMatchingEditors([], opposed)).toBe(false)
  })
})
