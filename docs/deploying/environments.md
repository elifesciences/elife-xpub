# Environments

**Project Name:** elife-xpub

---

The "Project Name" is appended with the enivronment to give the "Stack Name". This is done in the form:

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

# How it works

## builder

This repo contains the scripts for building and deployment.

https://github.com/elifesciences/builder/blob/master/projects/elife.yaml#L1936-L1955

## elife-xpub-deployment

This holds the Jenkinsfile and Jenkinsfile.prod that define the piplines for the Stacks (see above)

## Jenkins

| Pipeline        | Description                                                                                                                    | Trigger                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| test-elife-xpub | elife-xpub-deployment [Jenkinsfile](https://github.com/elifesciences/elife-xpub-deployment/blob/develop/Jenkinsfile)           | Runs on commit to develop and commits to approved                                                                             |
| prod-elife-xpub | elife-xpub-deployment [Jenkinsfile.prod](https://github.com/elifesciences/elife-xpub-deployment/blob/develop/Jenkinsfile.prod) | Manually run [here](https://alfred.elifesciences.org/blue/organizations/jenkins/prod-elife-xpub/activity/), merges to master. |

# Steps used for creating new environment

In this example we created a new environment for "prod"

* Create new builder stack - VM, Sec Group, DNS etc ... called "elife-xpub--prod"

  * Done using ./bldr launch:elife-xpub,prod (then picks the saltstack up from the formula)
  * For "prod" this still deploys a local postgres

* Create New Jenkins pipeline: "prod-elife-xpub"

* This new pipeline needs to point to a new approved branch "approved", and is triggered manually.

* New Jenkins file in (elife-xpub-deployment) called "Jenkinsfile.prod"

Notes ... in time we need to set up an "elife-xpub--end2end" environment.- This will be a part of the normal CI pipeline of "test-elife-xpub" (i,e, not approved)
