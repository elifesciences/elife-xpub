const generateManifest = require('./manifest')
const sampleManuscript = require('./article.test.data')

describe('Manifest XML generator', () => {
  it('returns required items', async () => {
    const xml = await generateManifest(sampleManuscript.files)

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

/**
 *      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE manifest SYSTEM "manifest.dtd">
      <manifest version="1" xmlns="">

          <item id="xpub-121" type="article-metadata" submission-item-id="custom001" version="0">
              <description>Contains the submission metadata</description>
              <file-order>1</file-order>
              <instance media-type="application/xml" href="article.xml"/>
          </item>

          <item id="xpub-122" type="transfer-metadata" submission-item-id="custom002" version="0">
              <description>Contains information about the source and destination of the transfer</description>
              <file-order>1</file-order>
              <instance media-type="application/xml" href="transfer.xml"/>
          </item>

          <item id="xpub-123" type="manuscript" submission-item-id="custom003" version="0">
              <description>This is the main manuscript</description>
              <file-order>1</file-order>
              <instance media-type="application/pdf" href="manuscript.pdf"/>
          </item>

          <item id="xpub-124" type="disclosure" submission-item-id="custom004" version="0">
              <description>This is the disclosure</description>
              <file-order>1</file-order>
              <instance media-type="application/pdf" href="disclosure.pdf"/>
          </item>

          <item id="xpub-125" type="coverletter" submission-item-id="custom005" version="0">
              <description>This is the cover letter</description>
              <file-order>1</file-order>
              <instance media-type="text/html" href="cover_letter.html"/>
          </item>


      </manifest>

 */
