const { db } = require('pubsweet-server')
const pubsub = require('pubsweet-server/src/graphql/pubsub')

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

afterAll(async () => {
  await pubsub.destroy()
  await db.destroy()
})
