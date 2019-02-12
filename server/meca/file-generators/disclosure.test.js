const PDFParser = require('pdf2json')
const generatePdf = require('./disclosure')
const fs = require('fs')

describe('Disclosure PDF generator', () => {
  it('returns a string of a PDF', async () => {
    const document = await generatePdf({
      meta: {},
      teams: [{ role: 'author', teamMembers: [{ alias: {} }] }],
    })

    // save the document
    //
    fs.writeFileSync('./disc.pdf', document, err => {
      if (err) {
        return console.log(err)
      }
      return true
    })

    const pdfParser = new PDFParser()
    let errors = 0
    pdfParser.on('pdfParser_dataError', err => {
      errors += 1
      console.log(err)
    })

    expect(() => pdfParser.loadPDF('./disc.pdf')).not.toThrow()
    // console.log(JSON.stringify(pdfParser, null, 4))

    expect(document.substring(0, 6)).toBe('%PDF-1')
    expect(errors).toBe(0)
    expect(pdfParser.data).not.toBe(null)
    expect(pdfParser.PDFJS.pdfDocument).not.toBe(null)
  })
})
