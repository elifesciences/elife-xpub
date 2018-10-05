const path = require('path')
const resolve = require('./webpack/common-resolve')

module.exports = {
  sections: [
    {
      name: 'App components',
      components: 'app/components/*/**/*.js',
    },
    {
      name: 'PubSweet components',
      components: 'client/*/**/*.js',
    },
  ],
  webpackConfig: {
    module: {
      rules: require('./webpack/rules.js'),
    },
    resolve,
  },
  context: {
    formik: 'formik',
  },
  ignore: [
    '**/node_modules/**',
    '**/*.test.{js,jsx}',
    '**/icons/material/*.js',
  ],
  styleguideComponents: {
    StyleGuideRenderer: path.join(
      __dirname,
      'styleguide/components/StyleGuideRenderer',
    ),
    Wrapper: path.join(__dirname, 'styleguide/components/Wrapper'),
  },
  skipComponentsWithoutExample: true,
}
