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
        |     | Aggregates |       | services  |
        |     +------------+       +-----------+
        |
    +------------------------------------------+
    |              repositories                |
    +------------------------------------------+
    |           data access layer              |
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

```js
const { getSubmissionUseCase, updateSubmissionUseCase } = require('../use-cases')
const { submissionRepository } = require('../repositories')

const resolvers = {
  Query: {
    async submission(_, { id }, { user }) {
      return getSubmissionUseCase.initialize(new SubmissionRepository)
        .execute(id, user)
    },
  },

  Mutation: {
    async updateSubmission(_, { data }, { user }) {
      return updateSubmissionUseCase.initialize(new SubmissionRepository)
        .execute(data.id, user, data)
    }
  },
  //...
```

### Use-Cases

- What we call the use case layer is the equivalent of the application layer in Domain Driven Design.
  Its' responsibility is to transform the input data so that it can be consumed by the Aggregate Root(s).
- Configuration, services and infastructure layer classes (e.g. repositories) shoulde be injected via
  a required `initialize` method.
- An `execute` method must also be present and should implement the functionality of the use case.
- In general this layer will have an interface that maps one-to-one with the
  graphQL layer.

#### Example

##### use-cases/getSubmissionUseCase

The following is a very simple use case to return the submission data using its id. Note that the
`submissionRepository` instance was injected previously via the `initialize` method.

```js
async getSubmissionUseCase(submissionId, user) => {
  checkPermissions(submissionId, user)

  const submission = await this.submissionRepository.findById(submissionId)

  return submission.toJSON()
}
```

##### use-cases/updateSubmissionUseCase

A more elaborate use case is one that involves change the state of an Aggregate. The basic
workflow is to

- retrieve the Aggregate Root
- call the necessary methods of the Aggregate Root
- save the Aggregate Root using a repository instance

Any errors originating either in the Aggregate Root operations or in peristing the Aggregate
are handled at this level if necessary or passed back to the higher levels.

```js
async updateSubmissionUseCase(submissionId, user, data) => {
  checkPermission(submissionId, user)

  const submission = await submissionRepository.findById(submissionId)

  const submissionData = getSubmissionData(data)
  const editorTeams = getEditorTeams(data)
  const reviewerTeams = getReviewerTeams(data)

  try {
    submission.update(manuscriptData)
    submission.updateAuthorTeam(data.author)
    submission.updateEditorTeams(editorTeams)
    submission.updateReviewerTeams(reviewerTeams)

    await this.submissionRepository.save(submission)
  } catch (Error e) {
    // handle any errors here
  }

  return submission.toJSON()

}
```

### Value Obejcts

- A Value Object represents a concept that is defined only by its attributes. For example, two streets
  with exactly the same name and post code should be represented by a value object since there
  is only representation possible. Value Objects are
- Value Objects are immutable

#### Example:

```js
class Street {
  constructor(streetName, city, postCode) {
    this.streetName = streetName
    this.city = city
    this.postCode = postCode
  }
}
```

### Entities

- Entities are objects that "_are not fundamentally defined by their attributes, but rather
  by a thread of continuity and identity._"
- For example, two persons might share the same first name and last name but are two different
  persons, hence they would be represented by an Entity.
- Entities may provide methods to change or operate on internal attributes

#### Example

Person Entity:

```js
class Person {
  constructor(id, firstName, lastName) {
    ;(this.id = id), (this.firstName = firstName)
    this.lastName = lastName
  }

  setFirstName(firstName) {
    this.firstName = firstName
  }

  setLastName(lastName) {
    this.lastName = lastName
  }
}
```

### The Aggregate

- [See DDD_Aggregates](https://www.martinfowler.com/bliki/DDD_Aggregate.html)
  summarised by the following:
- The Aggregate is composed of Entities or Value Objects, with one of those (usually an Entity)
  as the Aggregate Root that serves as the entry point to the whole Aggregate
- The Aggregate enforces a consistency boundary across all the objects it manages.
- Aggregates are domain concepts
- No persistent references to objects other than the Aggregate Root from
  outside the Aggregate (e.g. no fields referring to them and/or
  foreign keys, but passing them around for computation is ok)
- No transaction crosses Aggregates boundaries, as they are the unit of
  consistency.
- An Aggregate is represented by a class instance that has no knowledge of persistence
  in the database.

#### Example

The Submission Entity acts as the Aggregate Root for the Domain. Note that how the Aggregate
stores its data internally is purely an internal concern.

```js
class Submission {
  constructor(submission, teams) {
    this.id = submission.id
    this.meta.title = submission.meta.title
    // assign rest of the attributes and maybe provide some checks and default values
    // ...

    this.teams = teams
  }

  update(submissionData) {
    // update the internal submission data and maybe provide some checks
  }

  updateAuthorTeam(authorTeam) {
    // update team entities and provide checks that ensure consistency
  }

  //...
}
```

#### Testing

Testing of Aggregates (and also entities) is done in memory only:

```js
describe('Submission') {
it('should update the manuscript', () => {
  const submission = new Submission({
    // submission data
  }, [{
    // team data
  }])

  submission.update({
    // updated submission data
  })

  expect(submission.toJSON()).isEqual({
    // expected json representation
  })
})}
```

### Repositories

- A Repository is responsible for persisting and retrieving Aggregates from a storage location (usually a database)
- There should be one Repository per Aggregate Root.
- A repository can either use a query builder or an ORM to interact with the database.
- When saving an Aggregate Root,

#### Example

Note: The query builder code is just for illustration purposes only.

```js
class SubmissionRepository {
  findById(submissionId) {
    return new Submission(
      // generic database query builder, pr
      this.db
        .table('manuscript')
        .where({ id: submissionId })
        .first(),
      this.db
        .table('teams')
        .where({ manuscript_id: submissionId })
        .get(),
    )
  }

  save(submission) {
    const subissionData = user.toJson()

    try {
      // start transaction
      this.db.transaction(query => {
        query
          .table('manuscript')
          .where({ id: submissionId })
          .update({
            /* manuscript data */
          })
        query
          .table('teams')
          .where({ manuscript_id: submission.id })
          .update({
            /* team data */
          })
      })
    } catch (Error) {
      // rollback
    }
  }
}
```

_Outstanding Questions_

- How do we pass Aggregates to other Aggregates - at the moment the constructor
  just contains config, models and services as parameter... are Aggregates a model?

### The Models

- The models are for encapsulating a single area of responsiblity in code for a
  particlar Entity within the system. Examples are, Files, SuggestedEditors,
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
