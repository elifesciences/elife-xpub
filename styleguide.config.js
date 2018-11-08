const path = require('path')
const webpackConfig = require('./webpack/webpack.styleguide.config')

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
  webpackConfig,
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
