process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

const config = require('config')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const rules = require('./rules.production')
const resolve = require('./common-resolve')

module.exports = [
  {
    // The configuration for the client
    name: 'app',
    target: 'web',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      app: ['./app'],
    },
    output: {
      path: path.join(__dirname, '..', '_build', 'assets'),
      filename: '[name].[hash].js',
      publicPath: '/assets/',
    },
    module: {
      rules,
    },
    resolve,
    // devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin(['assets'], {
        root: path.join(__dirname, '..', '_build'),
      }),
      new HtmlWebpackPlugin({
        title: 'xpub',
        template: '../app/index-production.html',
        inject: 'body',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.ContextReplacementPlugin(/./, __dirname, {
        [config.authsome.mode]: config.authsome.mode,
        [config.validations]: config.validations,
      }),
      new ExtractTextPlugin('styles/main.css'),
      new CopyWebpackPlugin([{ from: '../static' }]),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new UglifyJSPlugin({
        // sourceMap: true
      }),
    ],
    node: {
      fs: 'empty',
      __dirname: true,
    },
  },
]
