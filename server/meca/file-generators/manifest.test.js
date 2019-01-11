const generateManifest = require('./manifest')
const sampleManuscript = require('./article.test.data')

describe('Manifest XML generator', () => {
  it('returns required items', () => {
    const xml = generateManifest(sampleManuscript.files)

    // has article xml
    expect(xml).toContain(
      '<instance media-type="application/xml" href="article.xml"/>',
    )

    // has transfer xml
    expect(xml).toContain(
      '<instance media-type="application/xml" href="transfer.xml"/>',
    )

    // has manuscript
    expect(xml).toContain(
      '<instance media-type="application/pdf" href="manuscript.pdf"/>',
    )

    // has disclosure
    expect(xml).toContain(
      '<instance media-type="application/pdf" href="disclosure.pdf"/>',
    )

    // has cover letter
    expect(xml).toContain(
      '<instance media-type="text/html" href="cover_letter.html"/>',
    )

    // has supplementary file 1
    expect(xml).toContain(
      '<item id="00000001-6c48-4747-851c-ef806e8486b2" type="supplemental"',
    )

    // has supplementary file 2
    expect(xml).toContain(
      '<item id="00000002-6c48-4747-851c-ef806e8486b2" type="supplemental"',
    )
  })
})
