const config = require('config')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const rules = require('./rules')
const resolve = require('./common-resolve')

module.exports = [
  {
    name: 'app',
    watch: true,
    target: 'web',
    context: path.join(__dirname, '..', 'app', 'client'),
    entry: {
      app: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        'babel-polyfill',
        './index',
      ],
    },
    output: {
      path: path.join(__dirname, '..', '_build', 'assets'),
      filename: '[name].js',
      publicPath: '/assets/',
    },
    devtool: 'eval', // 'cheap-module-source-map',
    module: {
      rules,
    },
    resolve,
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.ContextReplacementPlugin(/./, __dirname, {
        [config.authsome.mode]: config.authsome.mode,
        [config.validations]: config.validations,
      }),
      new CopyWebpackPlugin([{ from: '../assets' }]),
    ],
    node: {
      fs: 'empty',
      __dirname: true,
    },
    externals: {
      config: 'config',
    },
  },
]
