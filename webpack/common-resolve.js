const path = require('path')

module.exports = {
  // symlinks: false, // needed so that babel doesn't look for plugins in components
  alias: {
    joi: 'joi-browser',
    ui: path.resolve(__dirname, '..', 'app', 'components', 'ui'),
    global: path.resolve(__dirname, '..', 'app', 'components', 'global'),
  },
  extensions: ['.js', '.jsx'],
}
