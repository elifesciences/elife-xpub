# Contributing to xPub

Date Last Updated: 15.06.18

## Introduction

This file outlines common default principles to govern how the team will use GitHub to organise its own workflow. This is to ensure that:

Current team members are clear on one common workflow.

We are able to easily on-board new starters with these introductory principles to team-working.

Stakeholders are able to easily track progression of the project.

## Our Principles

These are general principles which should be the norm apart from in extreme circumstances.

### Pull Requests

- When feedback is required, an assignee will open a PR with the 'WIP' prefix. See [this ADR](https://github.com/elifesciences/elife-xpub/blob/develop/docs/adr/0001-pull-request-workflow.md).
- The Developer raising the PR will be the one who merges that PR.
- As deployment is on a per-branch basis, once a PR is merged it is considered 'Done'.
- If a feature can reasonably be tested using an existing browser test, this will be undertaken before the PR is approved.
  - Any further or additional end-to-end testing will be raised in a new issue with the 'browser test' label and referencing the original issue.
- Unit tests are expected part of any PR, if not the reason should be included in the description.

### Issues

- Never start a new issue when there are PRs to review or work you can contribute to already in progress.
- Where possible, issues will include a user story and product requirements/acceptance criteria as well as links to relevant designs.
- Where possible, issues will be a part of a `Milestone` related to the product feature they contribute to.
- Issues should be broken down (Carpaccio) into the smallest pieces of work. If this results in lots of issues then use a milestone.
- After one days' effort, the assignee will add a comment to an issue and ask another develop to help (see previous point)
- An issue will never be re-opened, unless closed in error.
