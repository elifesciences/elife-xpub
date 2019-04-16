const readline = require('readline')
const fs = require('fs')

const logPath = process.env.XPUB_LOG_PATH || './'

describe('CI test for log filtering', () => {
  const lines = []

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
      const matches = line.match(/[^\s@]+@[^@,"]+\.[^\s@,"]+/g)
      if (matches) {
        console.log(`FOUND ${matches.length} emails`)
        matches.forEach(m => {
          expect(m).toBe('***@***.***')
        })
      }
    })
  })
})
