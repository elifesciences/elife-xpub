# CI/CD and Deployment

**[Deployment Dashboard](https://alfred.elifesciences.org/view/elife-xpub/)**

- [CI Pipeline](pipeline.md)
- [Kubernetes Local Setup](k8s.md)
- [Local Deployment Testing](https://github.com/elifesciences/elife-xpub-deployment/blob/develop/local-development.md)
- [Infrastructure](infrastructure.md)
- [Environments](environments.md)
- [Docker Catalogue](dockercatalogue.md)

## Notes

It is possible to re-deploy to a given environment - should a pipeline get stuck.
We have recently encountered this issue with the end-2-end environment.
This was remedied by running the following on `elife-xpub--end2end--1`

```
sudo salt-call state.highstate
```
