const jwt = require('jsonwebtoken')
const config = require('config')
const { createTables } = require('@pubsweet/db-manager')
const { Query, Mutation } = require('./resolvers')
const replaySetup = require('../../../../test/helpers/replay-setup')

describe('User', () => {
  beforeEach(async () => {
    await createTables(true)
    replaySetup('success')
  })

  describe('editors', () => {
    it('returns a list of senior editors', async () => {
      const result = await Query.editors({}, { role: 'senior-editor' })
      expect(result.length).toBeGreaterThanOrEqual(40)
      expect(result[0]).toEqual({
        id: '8d7e57b3',
        aff: undefined,
        name: 'Richard Aldrich',
        focuses: [
          'ion channels',
          'calcium binding proteins',
          'membrane transport',
          'allostery and cooperativity',
          'cellular neurophysiology',
          'biochemical neuroscience',
        ],
        expertises: [
          'Structural Biology and Molecular Biophysics',
          'Neuroscience',
        ],
      })
    })
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
