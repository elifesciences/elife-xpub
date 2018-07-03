# Infrastructure

**Project Name:** elife-xpub

---

All the necessary infrastructure is within [AWS under the elifesciences account](https://512686554592.signin.aws.amazon.com/console)

This is managed using [builder](https://github.com/elifesciences/builder) using the convention where the "Project Name" is appended with the environment to give the "Stack Name". This is done in the form:

```
{project name}--{env}
```

| Stack Name          | Description                                        |
| ------------------- | -------------------------------------------------- |
| elife-xpub--ci      | Runs tests as part of CI/CD                        |
| elife-xpub--demo    | [Demo site](https://demo--xpub.elifesciences.org/) |
| elife-xpub--prod    | [Production](https://xpub.elifesciences.org/)      |
| elife-xpub--end2end | TODO                                               |

This project has 3 active environments, and a fourth that will be configured closer to the time of actually going live. The end2end environment This env will be as close as possible to the prod env. (e.g. RDS)

# Steps used for creating new stack

In this example we created a new environment for "prod"

* Create new builder stack - VM, Sec Group, DNS etc ... called "elife-xpub--prod"

  * Done using ./bldr launch:elife-xpub,prod (then picks the saltstack up from the formula)
  * For "prod" this still deploys a local postgres

* Create New Jenkins pipeline: "prod-elife-xpub"

* This new pipeline needs to point to a new approved branch "approved", and is triggered manually.

* New Jenkins file in (elife-xpub-deployment) called "Jenkinsfile.prod"

Notes ... in time we need to set up an "elife-xpub--end2end" environment.- This will be a part of the normal CI pipeline of "test-elife-xpub" (i,e, not approved)
