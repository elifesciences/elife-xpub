const { withAuthsomeMiddleware } = require('../withAuthsomeMiddleware')

const injectFakeResolver = (
  resolverName = 'testResolver',
  resolverFn = async () => ({ authorized: true }),
  mockModels = {},
  mockPolicies = [],
) => {
  const mockResolver = jest.fn(resolverFn)

  const mockUseCases = {
    [`${resolverName}UseCase`]: {
      authsomePolicies: mockPolicies,
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
    { _models: mockModels },
  )

  return modifiedResolvers
}

module.exports = { injectFakeResolver }
