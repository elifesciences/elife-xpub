# 5. Domain Driven Design - Hindawi Architecture Pattern

Date: 13-03-2019

## Status

Proposed

## Context

The decision to go with a Domain Driven Design approach to architecture is well documented in this [shared document](https://docs.google.com/document/d/1fN4_0tAMCbPptn1cjauJdDwLMonOeaM7Ha4FK-Vao-k/) and summarised in this [presentation](https://docs.google.com/presentation/d/13YlQLMZPCsvCVdKVh6hsOUkS3PCAyuMATwikXVRMjQA) given during the March 2019 pubsweet meet. To summarise the rational behind this decision we want the architecture to allow for the following:

- Easy to extend without making existing code harder to maintain
- Easy to re-use with differing workflows without the need to edit large amounts of code

DDD allows us to separate our application into bound contexts (ie: submission/review steps) to make them easier to maintain and more modular. This separation should mean that adding new contexts should not make maintaining existing contexts more challenging and that context's that do not have overlapping boundaries (ie: **some** submission/review steps) could be altered or removed entirely without requiring changes to other, non-related contexts.

## Decision

## Consequences
