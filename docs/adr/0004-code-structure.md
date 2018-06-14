# 4. Code Structure

Date: 2018-06-14

## Status

Proposed

## Context

As the code rapidly grows we need a common structure and approach that will keep the code tidy and coherent.
There are various aspects, the initial concern was the data access separation. The issue #140 initially talked about how this could be separated in terms of an ORM (Object-Relational Mapping) or a DAL (Data Access Layer).
However, this discussion also soon covered the structure of the code in general and how to structure it for ease of development and best practise.

## Decision

In summary the server-side code will be structured below the `server` folder as follows:

* **entities** - This folder will contain subfolders relating to named entities in the system. See "Data Model Specification".

* **entities/\<entity\>** - The example below shows `Mansuscript` as an example entity, this folder will contain a common set of files that describe the entity's behaviour. Each of these have a particular purpose explained below:

  * index.js - The main business logic, e.g. for `Manuscript` this could contain `getAuthor()`
  * typedefs.js - Contains the GraphQL types pertinant to this entity.
  * resolvers.js - Contains the GraphQL interface specified in terms of `Query` and `Mutation` 's for this entity. These in general should map onto the exposed functions from index.js. For example, `Manuscript` may contain a `Query` for `allManuscripts` and a `Mutation` for `createManuscript`.
  * data-access.js - Contains the functions for saving to and loading from the database. All references to the database and SQL that is written should remain private to this file.

* **manuscript-state-machine** - It is anticipated that this is where the most orchestration of the entites will take place. This has been created as a separate folder so that it can expand to implement the state transitions currently defined for the manuscript.

### Example

```
server
|
├── entities
|   |
│   ├── manuscript
│   │   ├── typedefs.js
│   │   ├── resolvers.js
│   │   ├── data-access.js
│   │   └── index.js
|   |
│   └── <entity>
│       ├── typedefs.js
│       ├── resolvers.js
│       ├── data-access.js
│       └── index.js
|
└── manuscript-state-machine
   └── index.js
```

## Consequences

There will need to be coordination with the team in order to implment this structure.

The outcome should result in:

* the developer instinctively knowing where to find a particular piece of code.
* the code-base having a scalable structure.
