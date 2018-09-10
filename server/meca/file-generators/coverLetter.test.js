const coverLetter = require('./coverLetter')

describe('Cover letter HTML generator', () => {
  it('returns HTML document', async () => {
    const html = await coverLetter({})
    expect(html).toContain('<!DOCTYPE html>')
  })

  test.each([
    ['coverLetter'],
    ['opposedSeniorEditorsReason'],
    ['opposedReviewingEditorsReason'],
    ['opposedReviewersReason'],
  ])('replaces %s', async key => {
    const randomString = Math.random()
      .toString(36)
      .substr(2)
    const html = await coverLetter({ [key]: randomString })
    expect(html).toContain(randomString)
  })
})
