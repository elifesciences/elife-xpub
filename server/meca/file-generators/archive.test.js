const JsZip = require('jszip')
const archive = require('./archive')

describe('Generate ZIP archive', () => {
  it('returns a zip buffer', async () => {
    const buffer = await archive({})
    expect(buffer.slice(0, 2).toString()).toEqual('PK')
  })

  it('contains all files', async () => {
    const buffer = await archive({
      'test.txt': 'This is a test',
      'other.pdf': 'PDF-1.3%',
    })
    const zip = await JsZip.loadAsync(buffer)
    expect(zip.filter(() => true).map(file => file.name)).toEqual([
      'test.txt',
      'other.pdf',
    ])
  })

  it('adds promises', async () => {
    const buffer = await archive({
      'async.txt': new Promise(resolve =>
        setTimeout(() => resolve('some content'), 5),
      ),
    })
    const zip = await JsZip.loadAsync(buffer)
    const file = await zip.file('async.txt').async('string')
    expect(file).toEqual('some content')
  })
})
