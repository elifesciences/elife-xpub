# 0006. Server Architecture

Date: 7th June 2019

## Status

Proposed

## Context

The server-side code has a number of issues making it difficult to test and
difficult to work with. This ADR proposes a way of layering the code to be
able to solve these issues and move towards a more DDD approach.

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
  dependencies will be created by this layer and injected into the appropriate
  aggregates / models.

#### Example

```js
const config = require('config')
const Storage = require('MyStorageService')
const Submission = require('aggregates/Submission')

const User = require('@elifesciences/component-model').UserModel
const File = require('@elifesciences/component-model').FileModel
const SuggestedEditors = require('@elifesciences/component-model').SuggestedEditorsModel
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
  summarised by the following:
- Aggregates are domain concepts
- No persistent references to objects other than the Aggregate Root from
  outside the Aggregate (e.g. no fields referring to them and/or
  foreign keys, but passing them around for computation is ok)
- No transaction crosses Aggregates boundaries, as they are the unit of
  consistency.

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
        suggestedEditors: await this.models.SuggestedEditors.findByManuscriptId(id),
        files: await this.models.File.get(config, fileId, this.services.Storage)
      }
    }
  }
}
```

_Outstanding Questions_

- How do we pass Aggregates to other aggregates - at the moment the constructor
  just contains config, models and services as parameter... are aggregates a model?

### The Models

- The models are for encapsulating a single are of responsiblity in code for a
  particlar entity within the system. Examples are, Files, SuggestedEditors,
  Users, etc.
- They delegate accessing the data to/from the database to the underlying
  data access layer. For example, `SuggestedEditors` is a model that uses the
  `Team` table - it happens to be a list of people but is not a DDD Aggregate.
- Use Sequelize?

#### Example

```js
// Note all dependencies injected.

class File {
  static async get(config, id, storage) {
    const datamodel = config.datamodel.File // a bit of dependency inversion?
    return {
      FileMeta: await datamodel.get(id)
      FileContent: await storage.getFile(id)
    }
  }
}
```

### The Data Access Layer

- This layer exists to abstract the code from the data store by using the
  [Repository Pattern](https://www.martinfowler.com/eaaCatalog/repository.html).
- Only contains logic to read/write data to the data store.
- Exposes an interface that is written in terms of the domain languague.

#### Example

```js
const db = require('@pubsweet/db-manager')

class xPubRepository {
  async getSuggestedEditors(manuscript_id) {
    return db.query('team').where({ manuscript_id, role: 'suggestedEditors' })
  }
}
```

## Decision

! Record decision here !

## Consequences

- Time / Cost / Quality / Risk
