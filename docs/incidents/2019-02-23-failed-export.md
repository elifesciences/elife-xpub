# 2019-02-23

**Incident Leader: Hannah Drury**

## Description

- MECA exports not being accepted by EJP

## Timeline

2019-02-22 (Friday)

10:51: Unicode character removal PR [#1562](https://github.com/elifesciences/elife-xpub/pull/1562) is merged in and subsequently deployed to production, causing the issue.

2019-02-23 (Saturday)

09:06: Hannah received email from Andy from editorial

10:30: Hannah reads the email and acknowledges the email in #xpub-tech on Slack

10:32: Peter confirms that he's received the email and starts looking into the issue

10:34: Hannah suggests we switch back to using EJP for 100% of users to mitigate the issue

Peter didn't have permissions to implement the suggested solution

10:40: Peter suggests we bypass the filter and hardcode to use EJP

10:47: Peter raises the above PR within the builder repository

Peter and Hannah didn't have permissions to merge it in

10:52: Peter tries to contact Paul Shannon to grant access

11:22: Paul helps to get the PR merged

11:27: Peter alerts that Jenkins hadn't run any builds in response to the PR being merged

11:29: Peter contacts #incident-response to request help on Jenkins

12:08: Giorgio does not approve the initial change that went in

12:27: Giorgio changes the filter to direct 100% of traffic to EJP, which was the initial solution that was attempted at 10:34

12:53: incident was mitigated

At this point, there are two changes introduced to mitigate the incident:
- user filter is at 100% traffic to EJP
- journal site submit button points directly to submit.elifesciences.org

2019-02-25 (Monday)

At some point, the cause is found..

11:28: Peter raises https://github.com/elifesciences/elife-xpub/pull/1573 to fix the issue

13:43: Peter's PR gets merged in

Steps are now taken to direct 50% of traffic back to xpub 

xPub user filter is re-enabled in a PR

14:00: Cory raises a PR to change the destination of the button back to what it was

15:56: Cory's PR get's merged 

2019-02-26 (Tuesday)

~08:00: user filter PR is merged

08:51: Peter announces in the #xpub channel that incident had been resolved, and traffic was being directed to xPub

## Contributing Factor(s)

### Incident mitigation
- Peter didn't have permissions in some respositories which slowed down the response to the incident
- Unclear why Jenkins didn't deploy the changes made
- Giorgio was the only person available who could change the user filter

### Cause of the incident
- https://github.com/elifesciences/elife-xpub/pull/1562/ changed the values being passed to the manifest generator so they didn't include IDs, mime types, etc
- Test was asserting on the wrong values (i.e. the MIME types and IDs within the manifest file, within the MECA export)
<!-- - Difficult to see what the assertions were due to snapshot testing -->
- EJP as an external service had no way that we know of to test out the MECA export

## Stabilization Steps ( TBC)

- Manual fix
- Another manual fix
- Ultimate root cause fix

## Impact

MTTD: 22:15

MTTR: 03:47

## Corrective Actions

- Peter and Cory now have permissions to update the user filter
- Make a decision as to whether we have a holding page or whether we switch back to EJP, if a major incident in the future was cause downtime
- Peter to investigate why Jenkins didn't deploy the incident mitigation changes made on Saturday
- Consider introducing type checking
- Investigate testing EJP via end2end testing
