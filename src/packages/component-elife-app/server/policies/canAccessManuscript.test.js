const { AUTHORIZATION_ERROR_MESSAGE } = require('../withAuthsomeMiddleware')

const { canAccessManuscript } = require('.')
const { injectFakeResolver } = require('./testHelpers')
const { AuthorizationError } = require('@pubsweet/errors')

describe('policy: canAccessManuscript', async () => {
  const mockManuscript = {
    findById: jest.fn(async m => {
      if (m === 'exampleManuscriptId') {
        return { createdBy: 'a_valid_user' }
      }
      throw new Error('some error')
    }),
  }

  const resolver1Name = 'test'

  const modifiedResolvers = injectFakeResolver(
    resolver1Name,
    async () => ({ authorized: true }),
    { Manuscript: mockManuscript },
    ['isAuthenticated', canAccessManuscript],
  )

  it('allows the author of a manuscript to access the resource', async () => {
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'params' },
        { manuscriptId: 'exampleManuscriptId' },
        { user: 'a_valid_user' },
      ),
    ).resolves.toEqual({ authorized: true })
  })
  it('rejects any other user', async () => {
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'params' },
        { manuscriptId: 'exampleManuscriptId' },
        { user: 'a_different_user' },
      ),
    ).rejects.toEqual(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE))
  })
})
