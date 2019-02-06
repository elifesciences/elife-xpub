const path = require('path')

module.exports = {
  // symlinks: false, // needed so that babel doesn't look for plugins in components
  alias: {
    joi: 'joi-browser',
    ui: path.resolve(__dirname, '..', 'app', 'components', 'ui'),
  },
  extensions: ['.js', '.jsx'],
  // modules: [path.join(__dirname, 'app', 'components', 'ui'), 'node_modules'],
}
