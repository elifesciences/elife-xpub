# 0007 React Components

Date: 12th June 2019

## Status

Proposed

## Context

There needs to be some general principles on best practise in creating react
components for the project. This should lead to more readable and testable
code which should always be the aim.

### Separation of View and Logic

- In general small easily understood logic or logic that is very specific
  should like near the code where it is used. Extracting such code would be
  an overhead and decrease readability.
- More generally logic should be extracted particularly where it is complex or
  re-useable. This will make it more easily testable and the calling code more
  readable.
- Please contribute more

### Use of React Hooks

- Please contribute more

### Testing Principles

- Stand alone logic should be tested with the current famework (currently jest)
- All react components in general should be tested using `testing-library/react`
- Please contribute more

## Decision

## Consequences
