const path = require('path')
const components = require('./components.json')
const logger = require('winston')

module.exports = {
  authsome: {
    mode: path.resolve(__dirname, 'authsome.js'),
  },
  validations: path.resolve(__dirname, 'validations.js'),
  pubsweet: {
    components,
  },
  'pubsweet-server': {
    db: {},
    port: 3000,
    logger,
    uploads: 'uploads',
  },
  'pubsweet-client': {
    API_ENDPOINT: '/api',
    'login-redirect': '/',
  },
  mailer: {
    from: 'dev@example.com',
    transport: {
      sendmail: true,
    },
  },
  'password-reset': {
    url: 'http://localhost:3000/password-reset',
    sender: 'dev@example.com',
  },
  'pubsweet-component-ink-backend': {
    inkEndpoint:
      process.env.INK_ENDPOINT || 'http://inkdemo-api.coko.foundation',
    email: process.env.INK_USERNAME,
    password: process.env.INK_PASSWORD,
    maxRetries: 500,
    recipes: {
      'editoria-typescript': '2',
    },
  },
  publicKeys: ['pubsweet-client', 'authsome', 'validations'],
}
