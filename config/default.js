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
    db: {
      // see https://node-postgres.com/features/connecting
      user: '',
      host: '',
      database: '',
      password: '',
      port: 5432,
    },
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
  aws: {
    credentials: {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    },
    s3: {
      s3ForcePathStyle: true,
      params: {
        Bucket: 'demo-elife-xpub',
      },
    },
  },
  meca: {
    s3: {
      remotePath: 'meca-archive/',
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
  // these keys are included in the webpack build for use on the client
  // make sure not to expose any secrets
  publicKeys: ['pubsweet-client', 'authsome', 'validations', 'fileUpload'],
}
