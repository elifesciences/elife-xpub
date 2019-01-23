# Data Privacy

Please familiarise yourself with the following information:

- [eLife's Privacy Notice](https://elifesciences.org/privacy)

## Overview

`elife-xpub` has been designed to integrate with [eLife's journal site](elifesciences.org).
As such users control and manage the privacy of their data via their [ORCiD](orcid.org) account.
eLife ensures that user data is kept up-to-date via the [Profiles Service](https://github.com/elifesciences/profiles)
and it's this service that `elife-xpub` interacts with to get all the user data.

## Review 2019-01-22

The Product Manager along with the Technical Lead reviewed the handling of data within `elife-xpub` as a precursor to launch with the Data Controller.

Findings:

- Create an xPub Privacy document to record these reviews. (this document).
- Ensure that developers have read through eLife's Privacy Notice (See link above).
- Need to add a line to the email that is sent to the email that the submitter supplies.
  This is to ensure that if it's the incorrect user, or sent in error the recepient knows how
  to request to be removed from the system. [Fixed](https://github.com/elifesciences/elife-xpub/issues/1366)
