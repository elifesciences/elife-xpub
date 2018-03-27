// replace "PUBSWEET_COMPONENTS" string in pubsweet-client

const components = require('../config/components.json')

const requireComponentsString = components
  .filter(name => {
    const component = require(name)
    // "client" or "frontend" for backwards compatibility
    return component.client || component.frontend
  })
  .map(name => `require('${name}')`)
  .join(', ')

module.exports = {
  test: /\.js$/,
  enforce: 'pre',
  // include: /pubsweet-client\/src\/components/,
  loader: 'string-replace-loader',
  options: {
    search: 'PUBSWEET_COMPONENTS',
    replace: `[${requireComponentsString}]`,
  },
}
