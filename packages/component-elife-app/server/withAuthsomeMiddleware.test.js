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
