# Infrastructure

**Project Name:** elife-xpub

---

All the necessary infrastructure is within [AWS under the elifesciences account](https://512686554592.signin.aws.amazon.com/console)

This is managed using [builder](https://github.com/elifesciences/builder) using the convention where the "Project Name" is appended with the environment to give the "Stack Name". This is done in the form:

```
{project name}--{env}
```

| Stack Name          | Description                                         |
| ------------------- | --------------------------------------------------- |
| elife-xpub--end2end | [End2End](https://end2end--xpub.elifesciences.org/) |
| elife-xpub--staging | [Staging](https://staging--xpub.elifesciences.org/) |
| elife-xpub--prod    | [Production](https://xpub.elifesciences.org/)       |

This project has 4 active environments. The `end2end` and `staging` environments are as close as possible to the `prod` env. (e.g. RDS, ELB, S3)

# Steps used for creating new stack

In this example we created a new environment for "prod"

- Create new builder stack - VM, Sec Group, DNS etc ... called "elife-xpub--prod"

  - Done using ./bldr launch:elife-xpub,prod (then picks the saltstack up from the formula)
  - For "prod" this still deploys a local postgres

- Create New Jenkins pipeline: "prod-elife-xpub". But any new environment needs to get added to one of the two existing Jenkins pipelines.

- This new pipeline needs to point to a new approved branch "approved", and is triggered manually.

- New Jenkins file in (elife-xpub-deployment) called "Jenkinsfile.prod"
