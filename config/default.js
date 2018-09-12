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
    morganLogFormat:
      ':remote-addr [:date[clf]] :method :url :status :graphql[operation] :res[content-length] :response-time ms',
  },
  'pubsweet-client': {
    API_ENDPOINT: '/api',
    'login-redirect': '/',
  },
  mailer: {
    from: 'dev@example.com',
    path: `${__dirname}/mailer`,
  },
  darServer: {
    basePath: 'uploads',
  },
  meca: {
    s3: {
      params: {
        Bucket: ''
      },
      region: '',
      credentials: {
        accessKeyId: '',
        secretAccessKey: ''
      }
    },
    sftp: {
      host: '',
      port: 22,
      username: '',
      password: '',
    },
    notificationEmail: '',
    remotePath: '/',
  },
  scienceBeam: {
    url: 'https://sciencebeam-texture.elifesciences.org/api/convert',
  },
  publicKeys: ['pubsweet-client', 'authsome', 'validations'],
}
