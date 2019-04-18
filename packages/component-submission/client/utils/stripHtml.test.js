import stripHtml from './stripHtml'

describe('stripHtml', () => {
  it('strips html from a string', () => {
    expect(stripHtml('<span><strong>Hello</strong> World</span>')).toEqual(
      'Hello World',
    )
  })
  it('Replaces close <p> tags with newlines', () => {
    expect(stripHtml('<p>a</p><p>b</p><p>c</p>')).toEqual('a\nb\nc\n')
  })
})
