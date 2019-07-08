const include = require('./babel-includes')
const stringReplaceRule = require('./string-replace')

const ifDev = (then, otherwise) =>
  process.env.NODE_ENV === 'development' ? then : otherwise

module.exports = [
  stringReplaceRule,
  {
    oneOf: [
      // ES6 JS
      {
        test: /\.jsx?$/,
        include,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-react',
              {
                targets: {
                  browser: true,
                  node: true,
                  esmodules: true,
                },
              },
            ],
            [
              '@babel/preset-env',
              {
                modules: 'cjs',
              },
            ],
          ],
          plugins: [
            ...ifDev([require('react-hot-loader/babel')], []),
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },

      // CSS Modules
      {
        test: /\.local\.css$/,
        include,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:8]',
            },
          },
        ],
      },

      // files
      {
        exclude: [/\.jsx?$/, /\.mjs$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
]
