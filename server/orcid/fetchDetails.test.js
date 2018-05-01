require('../../test/helpers/replay-setup')

const fetchDetails = require('./fetchDetails')

describe('Fetch ORCID author details', () => {
  it('gets email', async () => {
    const user = {
      orcid: '0000-0003-3146-0256',
      oauth: { accessToken: 'f7617529-f46a-40b1-99f4-4181859783ca' },
    }
    const response = await fetchDetails(user)
    console.log(`response`, response)
  })
})
