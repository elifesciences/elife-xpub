const path = require('path')
const config = require('config')
const fs = require('fs-extra')
const { pick } = require('lodash')

// can't use node-config in webpack so save whitelisted client config into the build and alias it below
const outputPath = path.resolve(__dirname, '..', '_build', 'config')
const clientConfig = pick(config, config.publicKeys)
fs.ensureDirSync(outputPath)
const clientConfigPath = path.join(outputPath, 'client-config.json')
fs.writeJsonSync(clientConfigPath, clientConfig, { spaces: 2 })

module.exports = {
  // symlinks: false, // needed so that babel doesn't look for plugins in components
  alias: {
    joi: 'joi-browser',
    config: clientConfigPath,
  },
  extensions: ['.js', '.jsx'],
}
