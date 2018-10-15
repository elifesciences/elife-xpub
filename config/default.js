const path = require('path')
const logger = require('winston')

module.exports = {
  authsome: {
    mode: path.resolve(__dirname, 'non-serializable/authsome.js'),
  },
  validations: path.resolve(__dirname, 'non-serializable/validations.js'),
  pubsweet: {
    components: [
      '@elifesciences/xpub-meca-export',
      '@elifesciences/xpub-server',
      '@pubsweet/component-send-email',
    ],
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
  elife: {
    api: {
      url: 'https://api.elifesciences.org/',
    },
    majorSubjectAreas: {
      'biochemistry-chemical-biology': 'Biochemistry and Chemical Biology',
      'cancer-biology': 'Cancer Biology',
      'cell-biology': 'Cell Biology',
      'chromosomes-gene-expression': 'Chromosomes and Gene Expression',
      'computational-systems-biology': 'Computational and Systems Biology',
      'developmental-biology-stem-cells':
        'Developmental Biology and Stem Cells',
      ecology: 'Ecology',
      'epidemiology-global-health': 'Epidemiology and Global Health',
      'evolutionary-biology': 'Evolutionary Biology',
      'genetics-genomics': 'Genetics and Genomics',
      'human-biology-medicine': 'Human Biology and Medicine',
      'immunology-inflammation': 'Immunology and Inflammation',
      'microbiology-infectious-disease': 'Microbiology and Infectious Disease',
      neuroscience: 'Neuroscience',
      'physics-living-systems': 'Physics of Living Systems',
      'plant-biology': 'Plant Biology',
      'structural-biology-molecular-biophysics':
        'Structural Biology and Molecular Biophysics',
    },
  },
  login: {
    // TODO swap this mock for the Journal endpoint when available
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
    signupUrl: 'https://orcid.org/register',
    legacySubmissionUrl: 'https://submit.elifesciences.org',
  },
  mailer: {
    from: 'dev@example.com',
    path: `${__dirname}/non-serializable/mailer`,
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
    apiKey: '',
    notificationEmail: '',
  },
  scienceBeam: {
    url: 'https://sciencebeam-texture.elifesciences.org/api/convert',
    timeoutMs: 3000,
  },
  fileUpload: {
    maxSizeMB: 100,
  },
  // these keys are included in the webpack build for use on the client
  // make sure not to expose any secrets
  publicKeys: [
    'pubsweet-client',
    'authsome',
    'validations',
    'fileUpload',
    'login',
    'elife.majorSubjectAreas',
  ],
}
