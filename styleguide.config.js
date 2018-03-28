module.exports = {
  components: 'app/components/**/*.js',
  webpackConfig: {
    module: {
      rules: require('./webpack/rules.development.js'),
    },
  },
}
