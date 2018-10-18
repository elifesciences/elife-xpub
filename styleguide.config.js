const path = require('path')

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
    resolve: {
      alias: {
        config: path.join(__dirname, 'styleguide/config.json'),
      },
    },
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
