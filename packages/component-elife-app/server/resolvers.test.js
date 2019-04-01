const jwt = require('jsonwebtoken')
const config = require('config')
const { createTables } = require('@pubsweet/db-manager')
const { Mutation } = require('./resolvers')
const replaySetup = require('../../../test/helpers/replay-setup')

describe('component-elife-app resolvers', () => {
  beforeEach(async () => {
    await createTables(true)
    replaySetup('success')
  })

  describe('exchangeJournalToken', () => {
    const secret = config.get('pubsweet-server.secret')

    it('fails with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: '1234', iss: 'journal', exp: 1538134996 },
        secret,
      )
      await expect(
        Mutation.exchangeJournalToken({}, { token: expiredToken }),
      ).rejects.toThrow('jwt expired')
    })

    it('fails with token from wrong issuer', async () => {
      const xpubToken = jwt.sign({ id: '1234', iss: 'xpub' }, secret, {
        expiresIn: '1d',
      })
      await expect(
        Mutation.exchangeJournalToken({}, { token: xpubToken }),
      ).rejects.toThrow('Cannot exchange xPub issued token')
    })

    it('fails with token with wrong signature', async () => {
      const xpubToken = jwt.sign(
        { id: '1234', iss: 'xpub' },
        'not the right secret',
        {
          expiresIn: '1d',
        },
      )
      await expect(
        Mutation.exchangeJournalToken({}, { token: xpubToken }),
      ).rejects.toThrow('invalid signature')
    })

    it('exchanges valid token and changes issuer', async () => {
      const journalToken = jwt.sign({ id: '1234', iss: 'journal' }, secret, {
        expiresIn: '1d',
      })
      const xpubToken = await Mutation.exchangeJournalToken(
        {},
        { token: journalToken },
      )
      const tokenContents = jwt.verify(xpubToken, secret)
      expect(tokenContents).toMatchObject({ id: '1234', iss: 'xpub' })
    })
  })
})
