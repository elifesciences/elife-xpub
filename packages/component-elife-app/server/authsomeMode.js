const BluebirdPromise = require('bluebird')

// Policy type: (user: string, operation: string, request: any, context?: any) => boolean
const authsomePolicies = {
  // TODO: Somehow extend this list?
  isAuthenticated: userId => !!userId,
  isNotAuthenticated: userId => !userId,
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

module.exports = { authsomeMode }
