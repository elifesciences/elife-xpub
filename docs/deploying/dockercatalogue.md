# Catalogue of Docker Images

`elife-xpub` is tested and deployed through Docker container images, which allow a reproducible environment and a atomic deployment over servers or container orchestrators.

All images listed here are available publicly on Docker Hub, and are pushed there by Jenkins builds.

## Image xpub/xpub

| tag      | description                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------- |
| base     | Original used                                                                                      |
| 20181213 | Pinned at node v8. Made as the base went to node v10 and this has issues with the `replay` package |

## Image elifesciences/elife-xpub

| tag      | description                                                              |
| -------- | ------------------------------------------------------------------------ |
| latest   | Always updated with the last `develop` commit that passed project tests  |
| 9c29c,,, | New image created for every commit that is built in CI, even in branches |
