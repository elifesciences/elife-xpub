const {
  withAuthsomeMiddleware,
  AUTHORIZATION_ERROR_MESSAGE,
} = require('../withAuthsomeMiddleware')
const { AuthorizationError } = require('@pubsweet/errors')

describe('policy: isAuthor', async () => {
  const resolver1Name = 'bobby'
  const mockResolver = jest.fn(() => ({ authorized: true }))
  const mockManuscript = {
    findByIdAndAuthor: jest.fn(async (m, u) => {
      if (u === 'a_valid_user' && m === 'exampleManuscriptId') {
        return { ok: true }
      } 
        throw new Error('some error')
      
    }),
  }

  const mockUseCases = {
    [`${resolver1Name}UseCase`]: {
      authsomePolicies: ['isAuthenticated', 'isAuthor'],
    },
  }

  const mockResolvers = {
    Mutation: {
      [resolver1Name]: mockResolver,
    },
  }

  const modifiedResolvers = withAuthsomeMiddleware(
    mockResolvers,
    mockUseCases,
    { _models: { Manuscript: mockManuscript } },
  )

  it('allows the author of a manuscript to access the resource', async done => {
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'params' },
        { manuscriptId: 'exampleManuscriptId' },
        { user: 'a_valid_user' },
      ),
    ).resolves.toEqual({ authorized: true })
    done()
  })
  it('rejects any other user', async done => {
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'params' },
        { manuscriptId: 'exampleManuscriptId' },
        { user: 'a_different_user' },
      ),
    ).rejects.toEqual(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE))
    done()
  })
})
