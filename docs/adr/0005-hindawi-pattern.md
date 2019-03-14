# 5. Domain Driven Design - Hindawi Architecture Pattern

Date: 13-03-2019

## Status

Proposed

## Context

The decision to go with a Domain Driven Design approach to architecture is well documented in this [shared document](https://docs.google.com/document/d/1fN4_0tAMCbPptn1cjauJdDwLMonOeaM7Ha4FK-Vao-k/) and summarised in this [presentation](https://docs.google.com/presentation/d/13YlQLMZPCsvCVdKVh6hsOUkS3PCAyuMATwikXVRMjQA) given during the March 2019 PubSweet meet. To summarise the objectives of the re-architecture, we want to make the application:

- Easy to extend without making existing code harder to maintain
- Easy to re-use with differing workflows without the need to edit large amounts of code

DDD allows us to separate our application into bound contexts (ie: submission/review steps) to make them easier to maintain and more modular. This separation should mean that adding new contexts should not make maintaining existing contexts more challenging and that contexts that do not have overlapping boundaries (ie: **some** submission/review steps) could be altered or removed entirely without requiring changes to other, non-related contexts.

While at the March 2019 PubSweet meet, Hindawi demonstrated their open-source project [xpub-reviewer](https://gitlab.com/hindawi/xpub/xpub-review) which showed their approach to DDD put into practice. As we at eLife were still early on in the planning stage of how to implement a DDD approach to our own application, we decided it would be beneficial to take a similar approach to Hindawi so as to be able to share experience between organisations and possibly feed back into our shared framework [PubSweet](https://gitlab.coko.foundation/pubsweet/pubsweet) making it easier for others to follow a similar design pattern.

## Decision

We initially plan to convert our current code base structure to match that of Hindawi's repository. Once this is complete we will then attempt to fix some of the concerns we have identified with this implementation, making sure to consult with Hindawi to ensure we maintain as similar an approach as possible. Once these details have been addressed we can then try to identify sections of the two applications which are the same/similar to then recommend inclusion in future releases of PubSweet where they can then be easily adopted and maintained by the wider community.

### Overview of suggested architecture pattern

The suggested pattern of architecture would be to place each bound context, both client and server side code it its own self-contained `component` directory, with the naming convention `component-xxxx` for bound contexts and `component-model-xxxx` for any shared data-model components. These would then leverage PubSweet's ability to pull in resolvers to form a full server side system while the client would make use of an `app` directory which contains a React router which pulls together the different client-side components. An example file structure can be found below

```
/packages
  /app
  /component-dashboard
  /component-login
  /component-submission
  /component-model-manuscript
  /component-model-file
  /component-elife-ui
  ...
```

Each component behaves like a stand alone module with its own `package.json`, `/config`, `/src` and `/test` directory (some don't have `/config`).

Context components are then structured:

```
/component-xxxx
  /client
    /components
    /graphql
    /pages
    /tests
  /config
  /server
    /src
      /use-cases
      resolvers.js
      typeDefs.graphqls
    /tests
  index.js
  package.json
```

Model components are structured:

```
/component-model-xxxx
  /src
    /entities
    /use-cases
      resolvers.js
      typeDefs.graphqls
  /congig
  /test
  index.js
  package.json
```

### Pros
- Easy to extend without making existing code harder to maintain
- Easy to re-use with differing workflows without the need to edit large amounts of code
- Flexible directory structure within components means we can pick and choose whether we include tests, client-side code, etc.
- Components should have a single responsibility
- Models are injected making testing easier
- Better seperation of code makes testing easier

### Cons
- Some components don't need the same resources across the stack, so some components won't have UI or resolvers
- Components can have the need to rely on shared code, which is a sign of domains not having been decoupled from each other. This may lead to code duplication or components depending on each other
