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
  'auth-orcid': {
    clientID: '',
    clientSecret: '',
    sandbox: true,
  },
  meca: {
    s3: {
      params: {
        Bucket: '',
      },
      connectionOptions: {
        s3ForcePathStyle: true,
        region: '',
        accessKeyId: '',
        secretAccessKey: '',
      },
      disableUpload: false,
    },
    sftp: {
      connectionOptions: {
        host: '',
        port: 22,
        username: '',
        password: '',
      },
      remotePath: '',
      disableUpload: false,
    },
    notificationEmail: '',
  },
  scienceBeam: {
    url: 'https://sciencebeam-texture.elifesciences.org/api/convert',
  },
  fileUpload: {
    maxSizeMB: 100,
  },
  publicKeys: ['pubsweet-client', 'authsome', 'validations', 'fileUpload'],
}
