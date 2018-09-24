# 2. Use of PubSweet

Date: 2018-06-05

## Status

Accepted

## Context

eLife needs to develop their own online journal submission and peer review system.

There were three options available:

- Build a system from scratch.
- Use [PubSweet](https://pubsweet.org/) an open source project built by the [Coko Foundation](https://coko.foundation/technology/)
- Consider using / licensing a closed-source alternative.

Building a system from scratch would be ruled out if there was a suitable existing project that could be used.

The option to use a closed-source was ruled out, even though one of these alternatives had plans to go open source this was considered too great a risk to the project.

## Decision

The decision was taken on Sept 2016 to use PubSweet. This decision was taken in-part due to another publisher [Hindawi](hindawi.com) also participating in the collaboration.

We can keep track of dependencies on PubSweet components, all components used are to be recorded in: [PubSweet.md](../developing/PubSweet.md)

## Consequences

- The opportuinty to contribute to PubSweet, thus the [wider community](https://coko.foundation/community/partners-projects/)
- PubSweet mandates the use of [React](https://reactjs.org/)
