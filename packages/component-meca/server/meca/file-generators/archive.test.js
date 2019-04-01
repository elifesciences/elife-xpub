const JsZip = require('jszip')
const archive = require('./archive')

describe('Generate ZIP archive', () => {
  it('returns a zip buffer', async () => {
    const buffer = await archive({})
    expect(buffer.slice(0, 2).toString()).toEqual('PK')
  })

  it('contains all files', async () => {
    const buffer = await archive([
      { filename: 'test.txt', content: 'This is a test' },
      { filename: 'other.pdf', content: 'PDF-1.3%' },
    ])
    const zip = await JsZip.loadAsync(buffer)
    expect(zip.filter(() => true).map(file => file.name)).toEqual([
      'test.txt',
      'other.pdf',
    ])
  })

  it('adds promises', async () => {
    const buffer = await archive([
      {
        filename: 'async.txt',
        content: new Promise(resolve =>
          setTimeout(() => resolve('some content'), 5),
        ),
      },
    ])
    const zip = await JsZip.loadAsync(buffer)
    const file = await zip.file('async.txt').async('string')
    expect(file).toEqual('some content')
  })
})
