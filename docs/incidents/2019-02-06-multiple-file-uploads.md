# 2019-02-06

**Incident Leader: Peter**

## Description

Something went wrong and caused this problem.

## Timeline

All times UTC.

10:00 standup in which the overwriting file name issues is discussed and parked in favor of parallel file uploads being done beforehand

Peter understood that the file uploads issues were all to be parked, in favor of documentation

10:42 ticket created by Hem to make files upload in parallel as a prerequisite for other tickets.

Inadvertently added in the Todo column

Cory (and Hannah) thought that the work on file uploads will be large and postponed until further discussion.

Hem and Javier were already working on this part of the code and were familiar with the work needed to fix in 1449

Javier understood this small split task should be picked up immediately

~16:50: Hem and Javier manually test the feature in the review environment, and no race condition appears

16:57: https://github.com/elifesciences/elife-xpub/pull/1451 is merged

17:18: https://github.com/elifesciences/elife-xpub/pull/1451 is deployed in https://alfred.elifesciences.org/job/prod-elife-xpub/60/

18:10: Peter raises concerns about https://github.com/elifesciences/elife-xpub/pull/1451

20:10: "seems like multifile upload is broken in production": database state changes not deterministic in updating the frontend, e.g. spinners

20:18: Peter confirms this is a UI problem, not a database problem

20:26: Hannah requests a revert, since:

- we are out of hours
- unclear time to repair

Peter and Cory run more tests, but unclear on what to do, delaying the revert decision until tests are finished

20:39: Hem comes in, and says he didn't know the pull request would be deployed. Think code is production-ready, but not knowing the PR is in production.

20:42: Hem raises a PR with the intent of having a revert option

20:45: Hannah decides for the revert

20:57: Peter says PR is merged

21:28: testing in staging is ok

Peter kicks off https://alfred.elifesciences.org/job/prod-elife-xpub/ manually

21:45: testing in production is ok

## Contributing Factor(s)

- Tech lead and product owner busy all days and not tuning the priorities
- Not enough review on the PR, 2 approvers was dropped down to 1
- Pairing leads to review being performed by the navigator, is it bad or good?
- PR merged out of hours
- Difficult to automatically test for race conditions, little coverage for it

## Stabilization Steps

- Revert the PR identified as the source of the problem

## Impact

MTTD: 2h52m

MTTR: 1h35m

## Corrective Actions

- Evaluate: 2 reviewers as a minimum for merge, or dynamic number of reviewers by the requestor
- Take a decision for "merge your own PRs" vs. "merge other people's PRs"
