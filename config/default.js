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
    enableExperimentalGraphql: true,
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
  darServer: {
    basePath: path.join(__dirname, '..', 'manuscripts'),
  },
  publicKeys: ['pubsweet-client', 'authsome', 'validations'],
}
