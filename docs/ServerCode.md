# Server Code Refactor

Server code to be written in this way:

## General Principles

This approach uses SOLID Principles.

- The external interface uses graphQL and these are handled with resolvers.
- The resolvers should contain no logic themselves. Rather this is delegated to a `use-case`
  Resolvers are a thin wrapper around the controller logic.
- The component config carries the information about what services it uses.

## Example - Getting a Submission

### Component Config (cmpt-config.json)

```
{
  storage: S3Storage
  dataconnection: ...
}
```

### The Resolver

```
const { getSubmissionUseCase, } = require('../use-cases')
const { Submission } = require('../aggregates')

const resolvers = {
  Query: {
    async manuscript(_, { id }, { user }) {
      return getSubmissionUseCase
        .initialize({ submission })
        .execute(id, userUuid)
    },
    ...
  }

  ...
```

### The use-case

```
const cmptConfig = require('../cmpt-config')

const ucSubmission = ({ submission }) => ({
  execute: async (manuscriptId, user) => {
    const userUuid = await models.User.getUuidForProfile(user)
    await submission.initialize(manuscriptId, userUuid)
    return submission.toJSON()
  },
})

module.exports = {
  initialize,
}
```
