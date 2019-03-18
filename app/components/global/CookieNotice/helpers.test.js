import Helpers from './helpers'

describe('getCookieValue', () => {
  it('returns correct cookie value', () => {
    const documentCookie = 'foo=a; bar=b; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    expect(Helpers.getCookieValue('foo', documentCookie)).toBe('a')
    expect(Helpers.getCookieValue('bar', documentCookie)).toBe('b')
  })
})
