# Server Side

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
    |      Use Cases       +<------+  config   |
    +----------------------+       +-----------+
        |           |                    |
        |     +------------+       +-----------+
        |     | Aggregates |       | Services  |
        |     +------------+       +-----------+
        |
    +------------------------------------------+
    |              Repositories                |
    +------------------------------------------+
    |           Data Access Layer              |
    +------------------------------------------+

</pre>

---

## General Principles

Each of the following sections describes the general principles that are to
be used when writing code. This approach uses SOLID Principles.

### Value Objects

- A Value Object are useful for representing concepts that have intrinsic rules
  but lack identity.
- Two value objects that have exactly the same properties are considered to be equal.
  For example, two streets with exactly the same name and post code should be represented by the
  same value object.
- Value Objects are immutable and cannot be changed once instantiated.

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
- Entities may provide methods to change or operate on internal attributes.

#### Example

Person Entity:

```js
class Person {
  constructor(id, firstName, lastName) {
    this.id = id
    this.firstName = firstName
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

- An Aggregate is a collection of one or more related Entities and possibly Value Objects
- Access to the Aggregate is done through an Entity called the Aggregate Root.
- The Aggregate Root enforces the consistency rules throughout the Aggregate and therefore
  should not expose access to any of its children.
- No transaction crosses Aggregates boundaries, as they are the unit of
  consistency.

#### What goes in an Aggregate ?

- Its possible for an Aggregate to consist of oone Entity and nothing else.
- As a rule of thumb, if deleting an Aggregate Root does not delete some of its children,
  then those children probably belong to a different Aggregate.

#### Persistence

- Persistence is done via a Repository (see below)
- The Entities and Value Ojects in the Aggregate, including the Aggregate Root, must not
  have any storage functionality. All functionality should operate in memory without relying
  on any implementation detail from a persistence mechanism (Persistence agnosticism).

#### Links:

- [DDD_Aggregates](https://www.martinfowler.com/bliki/DDD_Aggregate.html)
- [Aggregate Pattern](https://deviq.com/aggregate-pattern/)

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
  })
})}
```

### Repositories

- A Repository is responsible for persisting and retrieving Aggregates from one or more storage locations (usually a database)
- There usually is one Repository per Aggregate, but in some case it might be acceptable for a Repository to operate
  on more than one Aggregate.
- A Repository can either use a query builder or an ORM to interact with the database.

#### Example

Note: The query builder code is just for illustration purposes only.

```js
class SubmissionRepository {
  findById(submissionId) {
    return new Submission(
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

#### Testing

- Repositories should be tested in an integration test.

```js
describe('SubmissionRepository', () => {
  it('should fetch Submission if it exists', () => {
    const submissionRepository = new SubmissionRepository
    const submission = submissionRepository.findById('id')

    expect(submission).not.toBeNull()
    expect(submission.toJson()).toEqual({
      /* expected submission data */
    })
  })

  it('should save Submission', () => {
    const submissionRepository = new SubmissionRepository
    const submission = new Submission(/* args go here */)

    const submission = submissionRepository.findById('id')

    expect(submission).not.toBeNull()
    expect(submission.toJson()).toEqual({
      /* expected submission data */
    })
  })
}
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
workflow is:

- retrieve the Aggregate Root
- call the necessary methods of the Aggregate Root
- save the Aggregate Root using a repository instance

Any errors originating either in the Aggregate Root operations or in peristing the Aggregate
are handled at this level if necessary or passed back to the higher levels.

```js
async updateSubmissionUseCase(submissionId, user, data) => {
  checkPermission(submissionId, user)

  const submission = await this.submissionRepository.findById(submissionId)

  // we assume those methods are defined elsewhere
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

const submissionRepository = new SubmissionRepository

const resolvers = {
  Query: {
    async submission(_, { id }, { user }) {
      return getSubmissionUseCase.initialize(submissionRepository)
        .execute(id, user)
    },
  },

  Mutation: {
    async updateSubmission(_, { data }, { user }) {
      return updateSubmissionUseCase.initialize(submissionRepository)
        .execute(data.id, user, data)
    }
  },
  //...
```

_Outstanding Questions_

- How do we pass Aggregates to other Aggregates - at the moment the constructor
  just contains config, models and services as parameter... are Aggregates a model?
- Can Use Cases use multiple Aggregate Roots or should that be at the level of the GraphQL
  resolver where they can use multiple use cases?
