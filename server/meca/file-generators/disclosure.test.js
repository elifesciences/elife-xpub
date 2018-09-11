const generatePdf = require('./disclosure')

describe('Disclosure PDF generator', () => {
  it('returns a string of a PDF', async () => {
    const document = await generatePdf({
      meta: {},
      teams: [{ role: 'author', teamMembers: [{ alias: {} }] }],
    })

    expect(document.substring(0, 6)).toBe('%PDF-1')
  })
})
