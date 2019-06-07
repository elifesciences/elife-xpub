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
It is imagined that for each domain (Submission, QC, Assign, Review, Decision)
there will be a package that implements this pattern for that domain.

<pre>

    +------------------------------------------+
    |            GraphQL Resolvers             |
    +------------------------------------------+
               |
    +----------------------+       +-----------+
    |      use cases       +<------+  config   |
    +----------------------+       +-----------+
        |           |                    |
        |     +------------+       +-----------+
        |     | aggregates |       | services  |
        |     +------------+       +-----------+
        |           |(n)
    +------------------------------------------+
    |                 models                   |
    +------------------------------------------+
    |             data access layer            |
    +------------------------------------------+

</pre>

---

## General Principles

Each of the following sections describes the general principles that are to
be used when writing code. This approach uses SOLID Principles.

### GraphQL Resolvers

- The external interface uses graphQL and these are handled with the resolvers.
- The resolvers should contain no logic themselves. Rather this is delegated
  to a `use-case` making the resolvers a thin wrapper around the controller logic.
- Rationale is that it should be easy to implement another interface on the same
  logic.

#### Example

```
const { getSubmissionUseCase, } = require('use-cases')

const resolvers = {
  Query: {
    async manuscript(_, { id }, { user }) {
      return getSubmissionUseCase(id, user)
    },
    ...
  }
  ...
```

### Use-Cases

- In general this layer will have an interface that maps one-to-one with the
  graphQL layer.
- For a given use-case it will require certain services and config - these
  dependencies will be created by this layer and injected (when needed) into
  the aggregates / models.

#### Example

```js
const config = require('config')
const Storage = require('MyStorageService')
const Submission = require('aggregates/Submission')

const User = require('@elifesciences/component-model').UserModel
const File = require('@elifesciences/component-model').FileModel
const Team = require('@elifesciences/component-model').TeamModel
const Manuscript = require('@elifesciences/component-model').ManuscriptModel

async getSubmissionUseCase(manuscriptId, user) => {
  checkPermissions(id, user)
  const models = { ... }
  const services = { Storage, ... }
  const submission = new Submision(config, models, services)
  return submission.get(manuscriptId, user).toJSON()
}

module.exports = {
  getSubmissionUseCase,
}
```

### The Aggregate

- [See DDD_Aggregates](https://www.martinfowler.com/bliki/DDD_Aggregate.html)
- An aggregate

```js
// Note all dependencies injected.

class Submission {
  constructor(config, models, services) {
    this.config = config
    this.models = models
    this.storage = services.Storage
  }

  async get(id, user) {
      /*
      * Here we could get the files' contents, the teams and the manuscript
      * then stitch them together to send back
      */
      return {
        manuscript: await this.models.Manuscript.find(id),
        teams: await this.models.Team.findByManuscriptId(id),
        files: await this.models.File.get(
          this.config.datamodel.File,
          fileId,
          this.services.Storage)
      }
    }
  }
}
```

### The Models

- The models are for encapsulating a single are of responsiblity in code for a
  particlar entity within the system. Examples are, Files, Teams, Users, etc.
- They delegate accessing the data to/from the database to the underlying
  data access layer.
- Use Sequelize?

#### Example

```js
// Note all dependencies injected.

class File {
  static async get(datamodel, id, storage) {
    return {
      FileMeta: await datamodel.get(id)
      FileContent: await storage.getFile(id)
    }
  }
}
```

### The Data Access Layer

- This layer exists to abstract the code from the data store.
- Only contains logic to read/write data to the data store.

#### Example

```js
const db = require('@pubsweet/db-manager')

class File {
  static async get(config, id) {
    return db.query().where({ id })
  }
}
```

## Decision

! Record decision here !

## Consequences

- Time / Cost / Quality / Risk
