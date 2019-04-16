// This is not named .test.js because it shouldnt be run with
// the unit tests as there will be no logs to parse
const readline = require('readline')
const fs = require('fs')

const logPath = process.env.XPUB_LOG_PATH || '../..'

describe('CI test for log filtering', () => {
  const lines = []
  jest.setTimeout(30000)

  beforeAll(async done => {
    const rl = readline.createInterface({
      input: fs.createReadStream(`${logPath}/xpub.log`),
      console: false,
    })
    rl.on('line', line => {
      lines.push(line)
    })
      .on('close', () => {
        done()
      })
      .on('error', e => {
        console.log('error', e)
      })
  })

  it('should not have any email addresses inside the server logs', async () => {
    lines.forEach(line => {
      const matches = line.match(
        /[\w\d!#$%&'*+\-/=?^_`{|}~@]+@[\w\d-]+\.[^\s@,"]+/g,
      )
      expect(matches).toBeNull()
    })
  })
})
