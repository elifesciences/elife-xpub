import convertArrayToReadableList from './convertArrayToReadableList'

const testData = [
  {
    input: ['a'],
    output: '"a"',
  },
  {
    input: ['a', 'b'],
    output: '"a" and "b"',
  },
  {
    input: ['a', 'b', 'c'],
    output: '"a", "b" and "c"',
  },
]

describe('convertArrayToReadableList', () => {
  it('returns empty string when empty array passed', () => {
    expect(convertArrayToReadableList([])).toBe('')
  })
  it('returns expect string when array passed', () => {
    testData.forEach(test => {
      expect(convertArrayToReadableList(test.input)).toBe(test.output)
    })
  })
})
