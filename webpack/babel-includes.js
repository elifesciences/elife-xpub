const path = require('path')

// paths that use ES6 scripts and CSS modules
// TODO: compile components to ES5 for distribution
//
// I think the problem is that server modules are being packaged for webpack, and they're causing errors

module.exports = [
  // include our code
  path.join(__dirname, '..', 'app'),
  path.join(__dirname, '..', 'config'),
  path.join(__dirname, '..', 'client'),
  path.join(__dirname, '..', 'styleguide'),

  // include pubsweet and xpub packages which are published untranspiled
  /xpub-[^/]+\/src/,
  /pubsweet-[^/\\]+\/(?!node_modules)/,
  /@pubsweet\/[^/\\]+\/(?!node_modules)/,

  // include our component packages
  filepath =>
    // is a child of packages but not node_modules
    // and not server code
    filepath.match(/\/packages\//) &&
    (!filepath.match(/\/node_modules\//) && !filepath.match(/\/server\//)),
]
