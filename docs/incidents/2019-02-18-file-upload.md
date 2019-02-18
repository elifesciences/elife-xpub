# 2019-02-18

**Incident Leader: **

## Description

- Bad code had been deployed to production
- Progress of the uploading of a manuscript file was no longer being displayed to users
- This was a cosmetic/UX/interface issue

## Timeline

All times UTC.


Friday 15th Feburary

14:21: the original change was merged causing the issue

Conversation between Cory and Peter to talk about production issue and pencil a plan together

Cory reproted issue via Slack. Noticed that the upload progress wasn't correct. Suggested to revert the change that had been merged at 14:21 

Cory did some testing and confirmed that the original change was the cause of the bug in production

14:57: revert pull request created

15:07: Cory reported that CI failed on the revert. CI failed to known issue related to database relation conflicts

The pipeine was re-run. 

15:19: CI passed and revert was merged.

Semra looked into why the original change was causing the issue. Semra managed to find the issue and create a fix. This is still an ongoing piece of work.


Monday 18th February

Peter was looking at the CI.

09:21: Peter posted on Slack that a job had failed on CI.

Peter looked into the CI job, and noticed that a job on the xPub dashboard was red. 

The job was for the change which introduced the revert fix, which Peter confirmed based on the timestamp of the job. He then realised that the change hadn't been released to production because of this.

09:22: Peter then re-runs the job, which then passed. It's now believed that the original issue has been successfully reverted in production.

11:54: Peter checked the version deployed to production and confirms it's now the correct one.


## Contributing Factor(s)

- browser tests didn't capture this issue
- no tests captured the issue
- known issue on the pipeline not passing
- we didn't check that the pipeline had finished, due to our confidence in it
- there were no email notifications as there is no maintainers file to send emails to
- there was pressure to get the change merged in, which led to tests being done seperately to save time
- some of the pressure was from the process of having issues in progress for one day only
- there's risk involved due to the state of the existing code that needed refactoring


## Stabilization Steps

- Revert the change which introduced the issue in production
- Rerun the pipeline to fix the failure on CI for the revert fix
- Commit version was checked on the HTML of the application pages in Production, and verified that it was correct.

## Impact

- Caused a bad UX where user would not know whether there file was uploading, and could have concluded that the app was broken.

## Corrective Actions

- Everyone made aware that email notifications should be sent on build failures
- Reviewers and authors should verify the changes being introduced in review environments
- Team is expected to take responsibility on new changes being introduced. This is even more important now that we are deploying straight to production.
- Team is expected to defend code quality in the face of time pressures
- Ensure that there's sufficient test coverage before introducing refactors. This can/should be done in a preluding pull request.
- Ensure that changes aren't introduced without sufficient test coverage
