# 2019-03-11

**Incident Leader: Peter Hooper**

## Description

Invalid configuration of secrets for xpub in staging and production environments.

## Timeline

All times UTC.

2019-03-10 21:15 daily updates run on elife-xpub--prod and set configuration secrets to default values rather then real ones

2019-03-11 ~08:15 Peter notices some of the Hotjar feedback is strange, all stuck on the login page with sad emojis

Peter tries to log in into staging for an unrelated issue, he can't

Peter tries to log in into prod, he can't

09:01 #xpub-tech first message raising the issue

09:02 Chris can reproduce the problem

09:04 Chris does not see a JWT in the response from journal

09:05 moving to #incident-response

Chris checks the last VCL change on journal, no change since 2019-02-27

09:09 Chris reads the VCL and realizes the only supported flow is the user starting from xpub

09:12 confirmed journal is sending JWT correctly

09:18 Chris and Peter find in the xpub logs errors about failure to decode the JWT

Comparing the config of journal and xpub

09:20 xpub secret has been changed to ThisIsNotASecretOverrideItInYourEnvironment, the default value

09:28 can see the value is correct in Vault. Hypothesis is this was changed to an incorrect value during the nightly highstate. Other secrets are also not correct

09:32 read the highstate log, confirmed it changed the values at 21:16 previous day

09:34 rerun prod-elife-xpub for a redeploy, no change

Hannah is not available, Peter decides to send everyone to EJP

09:41 changing journal configuration to implement the decision

Terraform version is wrong, command fails

builder update.sh script doesn't address the problem

09:44 look at builder code, it checks for a minimum version of 0.11.10, the commands wants 0.11.11

Chris already changes the prerequisites script to run on Mac

09:47 local builder correctly reads the API key from Vault

09:51 journal configuration change is deployed

09:59 Giorgio joins

looking at master-server logs, 403 responses from Vault

the master-server Vault token has expired

10:08 default TTL for token is ~32 days

10:09 find a comment in master-server pillar (configuration) file saying the token expires on 2019-03-06

10:12 generating a new token, opening a PR

10:13 find [existing Github issue for expiring token](https://github.com/elifesciences/issues/issues/4755)

10:16 finish running [process-master-server](https://alfred.elifesciences.org/job/process/job/process-master-server/) pipeline to update the token value. Not a fix

10:17 find the state didn't run due to a `onlyif` statement

10:23 working out the pillar value is obsolete and not used anymore. An unmanaged file on the server is used instead

10:26 creating a temporary file to get pass `onlyif`, run `process-master-server` again

State runs, but uses the value in the file rather than the pillar value

10:28 change the file's contents to the new token, re-run `process-master-server` for the 3rd time

10:29 Peter confirms `elife-xpub-staging` is correctly getting the values from Vault

10:31 complete highstate on `staging`

On staging, Cory can't log in, Peter gets conflicting results. Uncertain about the state due to a GraphQL not reproducible issue.

Peter realizes there are two servers in `staging`, this is discovered to be the problem.

10:43 Peter runs manual highstates on both `elife-xpub--prod` servers, checking the values in the container

Peter re-runs the `prod-elife-xpub` pipeline to ensure there are no other problems

10:45 confirming log in works in `prod`

10:55 revert EJP change and traffic is now sent to `prod-elife-xpub`

Peter logs in into Xpub, continues to see the log in button, raises a separate issue

## Contributing Factor(s)

- expiring Vault token
- unawareness of daily updates
- lack of application-level validation of the configuration values
- fallback from Vault to builder-private hides the error
- obsolete pillar values that are not used anymore
- Terraform version required was not documented or checked in the outdated builder prerequisites
- no alerts were raised from New Relic, for lack of configuration

## Stabilization Steps

- send all users to EJP while the problem was occurring

## Impact

MTTD: 11:00

MTTR: 02:40

## Corrective Actions

- [Transition Vault integration to refresh tokens](https://github.com/elifesciences/issues/issues/4755) so that they don't expire
- Make fallback more specific in cases where it should hard fail and where it shouldn't e.g. `master-server` boostrap, `elife-xpub-formula` testing environments
- [New Relic client side monitoring](https://github.com/elifesciences/elife-xpub/issues/1464)
- [New Relic server side monitoring](https://rpm.newrelic.com/accounts/1451451/applications/162983119/filterable_errors#/table?top_facet=transactionUiName&barchart=barchart) is under-reporting errors
- xpub UI should show an error (issue already raised, but to be linked here)
