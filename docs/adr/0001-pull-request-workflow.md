# 1. Use pull requests as the primary development tool

Date: 2017-10-20

## Status

Accepted

## Context

Software is built incrementally as an accumulation of changes.

We want to continuously deliver changes on the mainline, but that has to be protected from breakages.

Short-lived pull requests allow:

- visibility of who is changing what.
- discussion and review from other people in the team.
- automated testing and other kind of checks to run, offloading work from humans to machines.

## Decision

We will open short-lived pull requests as the primary means for deploying a change.

## Consequences

Team members can be asked to review a pull request through Github.

Automated tests should run on pull requests, to provide automated feedback.

Committing directly to a mainline branch (`develop` or `master`) should only occur when necessary (e.g. infrastructure changes such as `builder-private`).

Working on a feature should mainly happen by adding or amending commits on a pull request, but we should be wary of feature branches remaining open for too long without being merged into the mainline.
