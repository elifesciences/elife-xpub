# 1. Workflow Solution for xPub

Date: 2018-06-01

## Status

Proposed

## Context

eLife follows a publication process that is a well defined workflow for a submission to follow to completion.
The editorial team are familiar with this process and commonly use the language in their day to day jobs.
[This workflow has been modelled](https://drive.google.com/drive/u/0/folders/1gRuWuoI9KcEwfgNrFYVNDUiQ5YzK88de) as part of the development work.

A simple library (npm package) [javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine) was used to codify this workflow. The code generates an image of the workflow: (manuscript-workflow)[https://github.com/diversemix/manuscript-workflow]

[Libero](https://github.com/libero/) also have had a requirement for workflow and have [decided on Airflow](https://github.com/libero/walking-skeleton/blob/master/adr/0003-workflow-system.md).
This solution was also considered for the submission workflow.
However, out of the box there is no solution for user interactions.
It is assumed that all tasks in the flow are processes performed on the server and not by a user.
There are plugins to overcome this but it does seem like its not the right tool for the job.

Two Other tools were also considered:

* [bpmn-engine](https://github.com/paed01/bpmn-engine)
* [node-workflow](https://github.com/joyent/node-workflow)

Both of these also did not support the idea of user interaction fully.
The `bpmn-engine` did have the concept of a userTask however this was treated as a distict entity separate from the `task` that forms the workflows.

## Decision

While it would be good to have a separate service that would have the responsibility to manage the submission's workflow in the system,
there does not seem to be anything that would readily support this.
The decision is to use the npm package `javascript-state-machine` as demo'ed above in the repo.
It is envisaged that this will be used to extend the `Manuscript` object within `xpub-elife`

## Consequences

There will be no separate UI and server components to handle the workflow.
The downside is the lack of a clear separation of concerns and so the code is at risk of rotting.
Extra care is needed by developers to ensure that the workflow is managed and encapsulated properly.
