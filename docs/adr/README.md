# Architecture Decision Record (ADR)

This is a method of recording key decisions that affect architecture and has been adopted by eLife.

## What are they?

A collection of records for "architecturally significant" decisions: those that affect:
 * the structure, 
 * non-functional characteristics, 
 * dependencies, 
 * interfaces, or 
 * construction techniques.

For more details please refer to [this blog article](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)

**Key Points:**
* ADRs will be numbered sequentially and monotonically. Numbers will not be reused.
* If a decision is reversed, we will keep the old one around, but mark it as superseded. (It's still relevant to know that it was the decision, but is no longer the decision.)

## How do I raise one?

 * Create an appropriate branch, and switch to using it.
 * Go to the `/docs/adr` folder and copy the template `nnn-Template.md` to be named at the appropriate index and with an appropriate title.
 * Generally ensure the **Status** is `Proposed`, unless the disucssions have already happened and the it could be `Accepted`.
 * Commit and push to the branch.
 * Raise a new PR to merge this branch into the mainline (currently `develop`)
 * Alert the relevant people / developers if no feedback is forth coming to ensure everyone has the opportunity to discuss.
 * This is then merged when there is concensus - or a decision has been reached. The merge should involve changing the status to `Accepted` or `Rejected.
