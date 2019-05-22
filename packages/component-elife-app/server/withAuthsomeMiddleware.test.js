const { withAuthsomeMiddleware } = require('./withAuthsomeMiddleware')

describe('withAuthsomeMiddleware', () => {
  it('It attaches a function to supplied resolvers', async done => {
    const resolverName = 'test'
    const mockResolver = jest.fn()
    const mockCanFn = jest.fn()

    const mockUseCases = {
      [`${resolverName}UseCase`]: {
        authsomePolicies: ['some_magic_string'],
      },
    }

    const mockResolvers = {
      Mutation: {
        [resolverName]: mockResolver,
      },
    }

    const modifiedResolvers = withAuthsomeMiddleware(
      mockResolvers,
      mockUseCases,
      mockCanFn,
    )

    await modifiedResolvers.Mutation[resolverName](
      { original: 'query' },
      { original: 'params' },
      { user: 'example_user' },
    )

    expect(mockCanFn.mock.calls).toEqual([
      [
        'example_user',
        { name: resolverName, policies: ['some_magic_string'] },
        { original: 'params' },
      ],
    ])

    expect(mockResolver.mock.calls).toEqual([
      [{ original: 'query' }, { original: 'params' }, { user: 'example_user' }],
    ])

    done()
  })
})
// TODO: It evaluates simple policies correctly
// TODO: It does not modify behaviour of resolvers that are not Mutations, Queries or Subscriptions
// TODO: When there is more than one policy per use case, and one fails, it does not execute the remainder of the policies
