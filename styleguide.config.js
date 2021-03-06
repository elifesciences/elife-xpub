const path = require('path')
const webpackConfig = require('./webpack/webpack.styleguide.config')

module.exports = {
  require: ['babel-polyfill'],
  sections: [
    {
      name: 'App components',
      sections: [
        {
          name: 'Global',
          components: 'packages/component-elife-ui/client/global/**/*.js',
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
          components: 'app/components/atoms/**/*.js',
        },
        {
          name: 'Molecules',
          components: 'app/components/molecules/**/*.js',
        },
        {
          name: 'PeoplePicker',
          components: 'app/components/peoplePicker/**/*.js',
        },
      ],
    },
    {
      name: 'Packages',
      sections: [
        {
          name: 'Dashboard',
          sections: [
            {
              name: 'Components',
              components:
                'packages/component-dashboard/client/components/**/*.js',
            },
          ],
        },
        {
          name: 'Elife UI',
          sections: [
            {
              name: 'Global',
              components: 'packages/component-elife-ui/client/global/**/*.js',
            },
            {
              name: 'UI',
              components: 'packages/component-elife-ui/client/**/*.js',
            },
          ],
        },
        {
          name: 'Login',
          sections: [
            {
              name: 'Client',
              components: 'packages/component-login/client/*.js',
            },
            {
              name: 'Components',
              components: 'packages/component-login/client/components/**/*.js',
            },
          ],
        },
        {
          name: 'Static Pages',
          sections: [
            {
              name: 'Components',
              components:
                'packages/component-static-pages/client/components/**/*.js',
            },
            {
              name: 'Pages',
              components:
                'packages/component-static-pages/client/pages/**/*.js',
            },
          ],
        },
        {
          name: 'Submission',
          sections: [
            {
              name: 'Components',
              components: 'packages/component-submission/client/**/*.js',
            },
          ],
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
