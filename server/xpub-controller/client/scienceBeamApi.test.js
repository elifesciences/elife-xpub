const fs = require('fs')

jest.mock('request-promise-native', () => ({
  post: (url, obj) => {
    const fileContents = fs.readFileSync(`${__dirname}/article.test.data.xml`)
    return fileContents
  },
}))

require('request-promise-native')
const { extractSemantics } = require('./scienceBeamApi')

describe('scienceBeamApi', () => {
  it('extracts correct data', async () => {
    const config = {
      get(key) {
        return ''
      },
    }

    const title = await extractSemantics(config, '', '', '')

    expect(title).toBe(
      'The Relationship Between Lamport Clocks and Interrupts Using Obi',
    )
  })
})
