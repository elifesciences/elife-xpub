# Pipeline

> **NOTE** This page uses mermaid to show the sequence diagram.

The following [sequence-diagram](https://mermaidjs.github.io/sequenceDiagram.html) shows how the building of this project is triggered from `xpub-elife` to the deployment on the [demo website](https://demo--xpub.elifesciences.org/login)

![Deployment pipeline](./deployment-pipeline.svg)

Diagram source:

```mermaid
sequenceDiagram
    participant GL as elife-xpub
    participant GH as elife-xpub-deployment
    participant DH as docker-hub
    participant JK as Jenkins
    participant WEB as elife-xpub--demo

    activate GL
    Note over GL: Build
    GL ->> DH: docker-push
    deactivate GL
    DH ->> JK: hook

    activate JK
    Note over JK: dependencies-elife-xpub-update-xpub
    JK ->> GH: update container version
    deactivate JK

    GH ->> JK: hook

    activate JK
    Note over JK: test-elife-xpub
    JK ->> WEB: deploy
    deactivate JK
```
