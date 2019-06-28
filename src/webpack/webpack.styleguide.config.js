const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const rules = require('./rules.js')

// here assets is being renamed to an relative path as on S3 are not serving the assets folder
rules.push({
  test: /\.js$/,
  loader: 'string-replace-loader',
  options: {
    search: '/assets/',
    replace: './assets/',
    flags: 'g',
  },
  include: [
    path.resolve(__dirname, '../app'),
    path.resolve(__dirname, '../packages'),
    path.resolve(__dirname, '../client'),
  ],
})

module.exports = {
  module: {
    rules,
  },
  resolve: {
    alias: {
      config: path.join(__dirname, '../styleguide/config.json'),
    },
  },
  plugins: [new CopyWebpackPlugin([{ from: './app/assets', to: 'assets' }])],
}
