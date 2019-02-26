const PDFParser = require('pdf2json')
const generatePdf = require('./disclosure')
const manuscript = require('./article.test.data.json')

describe('Disclosure PDF generator', () => {
  it('returns a string of a PDF', async () => {
    const document = await generatePdf(manuscript)

    const pdfParser = new PDFParser()
    let errors = 0
    pdfParser.on('pdfParser_dataError', err => {
      if (err) errors += 1
    })

    expect(() => pdfParser.parseBuffer(document)).not.toThrow()
    pdfParser.on('pdfParser_dataReady', pdfData => {
      expect(errors).toBe(0)
      expect(pdfParser.data).not.toBe(null)

      const jsonData = JSON.stringify(pdfParser.data)

      expect(jsonData.includes('Our%20privacy%20policy')).toBe(true)
      expect(jsonData.includes('Test%20User')).toBe(true)
      expect(jsonData.includes('A.Scientist')).toBe(true)
    })
  })
})
