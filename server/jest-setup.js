const db = require('@pubsweet/db-manager/src/db')
const replaySetup = require('../test/helpers/replay-setup')

replaySetup('success')

jest.mock('@pubsweet/component-send-email', () => ({
  mails: [],
  send(mailData) {
    return new Promise((resolve, reject) => {
      this.mails.push(mailData)
      resolve()
    })
  },
  getMails() {
    return this.mails
  },
  clearMails() {
    this.mails = []
  },
}))

afterAll(() => db.destroy())
