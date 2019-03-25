const path = require('path')
const logger = require('winston')

module.exports = {
  authsome: {
    isPublic: true,
    mode: path.resolve(__dirname, 'non-serializable/authsome.js'),
  },
  validations: path.resolve(__dirname, 'non-serializable/validations.js'),
  pubsweet: {
    components: [
      '@elifesciences/xpub-meca-export',
      '@elifesciences/component-model',
      '@elifesciences/xpub-server',
      '@elifesciences/xpub-controller',
      '@elifesciences/xpub-client-config',
      '@elifesciences/component-dashboard',
      '@elifesciences/component-submission',
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
    isPublic: true,
    API_ENDPOINT: '/api',
    'login-redirect': '/',
  },
  git: {
    sha: '',
    ref: '',
  },
  server: {
    api: {
      secret: '',
      url: 'https://prod--gateway.elifesciences.org/',
    },
  },
  client: {
    isPublic: true,
    majorSubjectAreas: {
      'biochemistry-chemical-biology': 'Biochemistry and Chemical Biology',
      'cancer-biology': 'Cancer Biology',
      'cell-biology': 'Cell Biology',
      'chromosomes-gene-expression': 'Chromosomes and Gene Expression',
      'computational-systems-biology': 'Computational and Systems Biology',
      'developmental-biology': 'Developmental Biology',
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
      'stem-cells-and-regenerative-medicine':
        'Stem Cells and Regenerative Medicine',
      'structural-biology-molecular-biophysics':
        'Structural Biology and Molecular Biophysics',
    },
  },
  login: {
    // TODO swap this mock for the Journal endpoint when available
    isPublic: true,
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
    signupUrl: 'https://orcid.org/register',
    legacySubmissionUrl: 'https://submit.elifesciences.org',
  },
  mailer: {
    from: 'dev@example.com',
    path: `${__dirname}/non-serializable/fake-mailer`,
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
        Bucket: 'dev-elife-xpub',
      },
    },
  },
  meca: {
    s3: {
      remotePath: 'meca-archive',
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
    email: {
      recipient: '',
      sender: 'errors@elifesciences.org',
      subjectPrefix: '',
    },
  },
  scienceBeam: {
    url: 'https://sciencebeam-texture.elifesciences.org/api/convert',
    timeoutMs: 20000,
  },
  fileUpload: {
    isPublic: true,
    maxSizeMB: 100,
  },
  newrelic: {
    isPublic: true,
    licenseKey: '',
    applicationID: '',
  },
  googleAnalytics: {
    isPublic: true,
    trackingId: '',
  },
  schema: {}, // schema extensions for pubsweet-server
  hotJar: {
    isPublic: true,
    enabled: true,
    snippetVersion: 6,
  },
  titles: {
    isPublic: true,
    '': 'Dashboard | eLife',
    'author-guide': 'Author guide | eLife',
    'reviewer-guide': 'Reviewer guide | eLife',
    'contact-us': 'Contact us | eLife',
    login: 'Login | eLife',
    submit: 'Submit | eLife',
  },
}
