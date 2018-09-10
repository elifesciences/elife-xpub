const manifest = require('./manifest')

describe('Manifest XML generator', () => {
  it('returns meaningful content', async () => {
    const xml = await manifest()
    expect(xml).toContain(
      '<instance media-type="text/html" href="cover_letter.html"/>',
    )
  })
})
