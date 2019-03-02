const xml2json = require('xml2json')
const manifestGenerator = require('./manifest')
const sampleManuscript = require('./article.test.data')

describe('Manifest XML generator', () => {
  it('returns required items', () => {
    const xml = manifestGenerator(sampleManuscript.files)

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
      '<instance media-type="application/pdf" href="00000000-6c48-4747-851c-ef806e8486b2.pdf"/>',
    )

    // has disclosure
    expect(xml).toContain(
      '<instance media-type="application/pdf" href="disclosure.pdf"/>',
    )

    // has cover letter
    expect(xml).toContain(
      '<instance media-type="application/pdf" href="cover_letter.pdf"/>',
    )

    // has supplementary file 1
    expect(xml).toContain(
      '<item id="00000001-6c48-4747-851c-ef806e8486b2" type="supplemental"',
    )

    // has supplementary file 2
    expect(xml).toContain(
      '<item id="00000002-6c48-4747-851c-ef806e8486b2" type="supplemental"',
    )

    // convert to json and match to snapshot
    const manifestJson = JSON.parse(xml2json.toJson(xml))

    expect(manifestJson).toMatchSnapshot()
  })
})
