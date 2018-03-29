const path = require('path')

module.exports = {
  components: 'app/components/**/*.js',
  webpackConfig: {
    module: {
      rules: require('./webpack/rules.development.js'),
    },
  },
  context: {
    formik: 'formik',
  },
  styleguideComponents: {
    StyleGuideRenderer: path.join(
      __dirname,
      'styleguide/components/StyleGuideRenderer',
    ),
    Wrapper: path.join(__dirname, 'styleguide/components/Wrapper'),
  },
}
