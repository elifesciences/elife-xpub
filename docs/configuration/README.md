# Configuration

`elife-xpub` can be configured using multiple different methods. The main method of configuration uses [node-config](https://github.com/lorenwest/node-config). 


The configuration methods for `node-config`, and their precedence, are as follows:

- `config/default.js` is used as the base configuration
- `config/${environment}.js` is used for environment specific configuration, which can be stored publically. The environment is specified by setting `NODE_CONFIG_ENV` to the appropriate environment.
- `config/custom-environment-variables.js` is used for environment specific secrets. This gets populated using configuration within [builder-configuration](https://github.com/elifesciences/builder-configuration), and injected into the app using [elife-xpub-formula](https://github.com/elifesciences/elife-xpub-formula) and [elife-xpub-deployment](https://github.com/elifesciences/elife-xpub-deployment).
