# Environments

**Project Name:** elife-xpub

---

Each of the "Stacks" (see infrastructure.md) is deployed to using Jenkins.
The configuration of which is stored in the github repo [elife-xpub-deployment](https://github.com/elifesciences/elife-xpub-deployment)

Note: The docker container is built and pushed to docker with [gitlab](https://github.com/elifesciences/elife-xpub/blob/develop/.gitlab-ci.yml).

## Jenkins

| Pipeline        | Description                                                                                                                    | Trigger                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| test-elife-xpub | elife-xpub-deployment [Jenkinsfile](https://github.com/elifesciences/elife-xpub-deployment/blob/develop/Jenkinsfile)           | Runs when a new docker container is pushed to [dockerhub](https://hub.docker.com/r/xpub/xpub-elife/tags/)                     |
| prod-elife-xpub | elife-xpub-deployment [Jenkinsfile.prod](https://github.com/elifesciences/elife-xpub-deployment/blob/develop/Jenkinsfile.prod) | Manually run [here](https://alfred.elifesciences.org/blue/organizations/jenkins/prod-elife-xpub/activity/), merges to master. |
