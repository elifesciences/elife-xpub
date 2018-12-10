# Style Guide

The style guide is a application that can be run to serve documentation about the components that are part of `elife-xpub`. This guide is similar to the [pattern library](https://ui-patterns.elifesciences.org/) in Journal.

## Running

The styleguide can be run with `npm run styleguide`, then browsing to:

```
http://localhost:6060/
```

Every pull request also deploys copy of the generated style guide at an URL of the form:

```
https://s3.amazonaws.com/ci-elife-xpub-styleguide/1168/index.html
```

where `1168` is the number of the pull request.
