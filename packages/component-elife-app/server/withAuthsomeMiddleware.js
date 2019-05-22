// const config = require('config')
const Authsome = require('authsome')
const { AuthorizationError } = require('@pubsweet/errors')
const BluebirdPromise = require('bluebird')

// const mode = require(config.get('authsome.mode')) // TODO: let's change this

const models = require('@pubsweet/models')

const STANDARD_TYPES = ['Query', 'Mutation', 'Subscription']

// TODO: Move these policies elsewhere
const authsomePolicies = {
  isAuthenticated: (userId, _a, _b, _c) => !!userId,
}

const authsomeMode = async (userId, { name, policies = [] }, object, context) =>
  BluebirdPromise.reduce(
    policies,
    async (acc, policy) => {
      if (acc === false) return acc

      if (typeof policy === 'function') {
        return policy(userId, name, object, context)
      }
      if (typeof authsomePolicies[policy] === 'function') {
        return authsomePolicies[policy](userId, name, object, context)
      }
      throw new Error(
        `⛔️ Cannot find policy '${policy}' for action '${name}'.`,
      )
    },
    true,
  )

const can = async (userId, verb, entity) => {
  const authsome = new Authsome({ mode: authsomeMode }, { models })

  const permission = await authsome.can(userId, verb, entity)

  if (!permission) {
    throw new AuthorizationError(`Operation not permitted :(`)
  }

  return permission.filter || (id => id)
}

const withAuthsomeMiddleware = (resolvers = {}, useCases = {}) =>
  Object.entries(resolvers).reduce(
    (acc, [gqlType, gqlResolvers]) => ({
      ...acc,
      [gqlType]: STANDARD_TYPES.includes(gqlType)
        ? injectMiddleware(gqlResolvers, useCases)
        : gqlResolvers,
    }),
    {},
  )

const injectMiddleware = (gqlResolvers, useCases) => {
  Object.entries(gqlResolvers).reduce(
    (acc, [name, originalResolver]) => ({
      ...acc,
      [name]: async (parentQuery, params, ctx) => {
        await can(
          ctx.user,
          {
            name,
            policies: useCases[`${name}UseCase`].authsomePolicies,
          },
          params,
        ) // NOTE: This will throw if the conditions don't pass

        return originalResolver(parentQuery, params, ctx)
      },
    }),
    {},
  )
}

module.exports = withAuthsomeMiddleware
