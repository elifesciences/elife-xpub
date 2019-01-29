# Catalogue of Docker Images

The description should include the "What" and "Why"

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
