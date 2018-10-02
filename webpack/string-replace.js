// replace "PUBSWEET_COMPONENTS" string in pubsweet-client
const config = require('config');

const components = config.get('pubsweet.components')

const requireComponentsString = components
  // resolve relative to working dir so that relative paths work
  .map(name => require.resolve(name, { paths: [process.cwd()] }))
  .filter(path => {
    const component = require(path)
    // "client" or "frontend" for backwards compatibility
    return component.client || component.frontend
  })
  .map(path => `require('${path}')`)
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
