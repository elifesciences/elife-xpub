const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const rules = require('./webpack/rules.js')

rules.push({
  test: /\.js$/,
  loader: 'string-replace-loader',
  options: {
    search: '/assets/',
    replace: './assets/',
    flags: 'g',
  },
  include: [path.resolve(__dirname, 'app'), path.resolve(__dirname, 'client')],
})

module.exports = {
  sections: [
    {
      name: 'App components',
      sections: [
        {
          name: 'Global',
          components: 'app/components/global/**/*.js',
        },
        {
          name: 'Pages',
          components: 'app/components/pages/**/*.js',
        },
        {
          name: 'Other',
          components: 'app/**/*.js',
          ignore: ['**/app/components/{global,pages,ui}/**/*.js'],
        },
      ],
    },
    {
      name: 'eLife UI',
      sections: [
        {
          name: 'Atoms',
          components: 'app/components/ui/atoms/**/*.js',
        },
        {
          name: 'Molecules',
          components: 'app/components/ui/molecules/**/*.js',
        },
      ],
    },
    {
      name: 'eLife PubSweet components',
      components: 'client/*/**/*.js',
    },
    {
      name: 'PubSweet UI (external)',
      href: 'https://ui-staging-zpqsip.gateway.ps.elifesciences.yld.io/',
    },
  ],
  webpackConfig: {
    module: {
      rules,
    },
    resolve: {
      alias: {
        config: path.join(__dirname, 'styleguide/config.json'),
      },
    },
    plugins: [new CopyWebpackPlugin([{ from: './assets', to: 'assets' }])],
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
  styleguideDir: '_build_styleguide',
  skipComponentsWithoutExample: true,
}
