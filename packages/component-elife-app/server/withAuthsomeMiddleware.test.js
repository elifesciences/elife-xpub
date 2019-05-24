const {
  withAuthsomeMiddleware,
  AUTHORIZATION_ERROR_MESSAGE,
} = require('./withAuthsomeMiddleware')
const { AuthorizationError } = require('@pubsweet/errors')

describe('withAuthsomeMiddleware', () => {
  it('It attaches a function to supplied resolvers', async done => {
    const resolverName = 'test'
    const policyString = 'somePolicy'
    const mockResolver = jest.fn()
    const mockCanFn = jest.fn()

    const mockUseCases = {
      [`${resolverName}UseCase`]: {
        authsomePolicies: [policyString],
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
      { _can: mockCanFn, _models: {} },
    )

    await modifiedResolvers.Mutation[resolverName](
      { original: 'query' },
      { original: 'params' },
      { user: 'example_user' },
    )

    expect(mockCanFn.mock.calls).toEqual([
      [
        'example_user',
        { name: resolverName, policies: [policyString] },
        { original: 'params' },
        {},
      ],
    ])

    expect(mockResolver.mock.calls).toEqual([
      [{ original: 'query' }, { original: 'params' }, { user: 'example_user' }],
    ])

    done()
  })

  it('Evaluates simple policies correctly', async done => {
    const resolver1Name = 'bobby'
    const resolver2Name = 'beans'
    const resolver3Name = 'blaster'
    const mockResolver = jest.fn(() => ({ authorized: true }))

    const mockUseCases = {
      [`${resolver1Name}UseCase`]: {
        // Use a global policy from `./authsomeNode.js`
        authsomePolicies: ['isAuthenticated'],
      },
      [`${resolver2Name}UseCase`]: {
        // Use a policy function declared inline also
        authsomePolicies: ['isAuthenticated', () => false],
      },
      [`${resolver3Name}UseCase`]: {
        // Use a global policy from `./authsomeNode.js`
        authsomePolicies: ['isNotAuthenticated'],
      },
    }

    const mockResolvers = {
      Mutation: {
        [resolver1Name]: mockResolver,
        [resolver2Name]: mockResolver,
        [resolver3Name]: mockResolver,
      },
      SomethingElse: {
        otherResolver: mockResolver,
      },
    }

    const modifiedResolvers = withAuthsomeMiddleware(
      mockResolvers,
      mockUseCases,
    )
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'query' },
        { original: 'params' },
        { user: 'a_valid_user' },
      ),
    ).resolves.toEqual({ authorized: true })

    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'query' },
        { original: 'params' },
        { user: undefined },
      ),
    ).rejects.toEqual(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE))

    await expect(
      modifiedResolvers.Mutation[resolver2Name](
        { original: 'query' },
        { original: 'params' },
        { user: undefined },
      ),
    ).rejects.toEqual(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE))

    await expect(
      modifiedResolvers.Mutation[resolver3Name](
        { original: 'query' },
        { original: 'params' },
        { user: undefined },
      ),
    ).resolves.toEqual({ authorized: true })
    done()
  })

  it("Errors noisily when it can't find a policy", async done => {
    const resolver1Name = 'bobby'
    const mockResolver = jest.fn(() => ({ authorized: true }))

    const policy = 'thisIsntARealPolicy'

    const mockUseCases = {
      [`${resolver1Name}UseCase`]: {
        // Use a global policy from `./authsomeNode.js`
        authsomePolicies: [policy],
      },
    }

    const mockResolvers = {
      Mutation: {
        [resolver1Name]: mockResolver,
      },
      SomethingElse: {
        otherResolver: mockResolver,
      },
    }

    const modifiedResolvers = withAuthsomeMiddleware(
      mockResolvers,
      mockUseCases,
    )
    await expect(
      modifiedResolvers.Mutation[resolver1Name](
        { original: 'query' },
        { original: 'params' },
        { user: 'a_valid_user' },
      ),
    ).rejects.toEqual(
      new Error(
        `⛔️ Cannot find policy '${policy}' for action '${resolver1Name}'.`,
      ),
    )

    done()
  })
})
// TODO: When there is more than one policy per use case, and one fails, it does not execute the remainder of the policies
