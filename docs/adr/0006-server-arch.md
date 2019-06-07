# 0006. Server Architecture

Date: 7th June 2019

## Status

Proposed

## Context

The server-side code has a number of issues with it which make it difficult to
test and difficult to work with. The cause of this is because in general the
code does not adhere to the SOLID principles.

This ADR proposes a new way of layering the code to be able to solve these issues.

## New Code Architecture

Below is a diagram and some example of how the new code architecture will work.

<pre>

    +----------------------+
    |                      |
    |  GraphQL Resolvers   |
    |                      |
    +----------------------+
              |
    +----------------------+       +-----------+
    |      use cases       +<------+  config   |
    +----------------------+       +-----------+
        |           |                    |
        |     +------------+       +-----------+
        |     | aggregates |       | services  |
        |     +------------+       +-----------+
        |           |(n)
    +----------------------+
    |       models         |
    +----------------------+
              |
    +----------------------+
    |  data access layer   |
    +----------------------+

</pre>

---

## General Principles

This approach uses SOLID Principles and the points are in no particular order.

### GraphQL Resolvers

- The external interface uses graphQL and these are handled with resolvers.
- The resolvers should contain no logic themselves. Rather this is delegated
  to a `use-case` making the resolvers a thin wrapper around the controller logic.

### Use-Case Layer (models & aggregates)

- In general this has an interface that maps one-to-one with the graphQL layer
- For a given use-case it will require certain services and config - these
  dependencies will be created by this layer and injected into the models.

### Data Access Layer

- Well defined interface to be used by the models
- Sequelize?

## Example - Getting a Submission

### The Resolver

```
const { getSubmissionUseCase, } = require('../use-cases')

const resolvers = {
  Query: {
    async manuscript(_, { id }, { user }) {
      return getSubmissionUseCase(id, user)
    },
    ...
  }

  ...
```

### The use-case

```
const Storage = require('MyStorageService')
const config = require('config')
const Submission = require('../aggregates/Submission')

async getSubmissionUseCase(manuscriptId, user) => {
  const submission = new Submision(config, Storage)
  return submission.get(manuscriptId, user).toJSON()
}

module.exports = {
  getSubmissionUseCase,
}
```

### The Aggregate

```js
class Submission {
  ctor(config, Storage) {}
  async get(id, user) {}
}
```

### The Models

```

```

### The Data Access Layer

## Decision

## Consequences
