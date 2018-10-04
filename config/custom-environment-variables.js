module.exports = {
  'pubsweet-server': {
    db: {
      user: 'PGUSER',
      host: 'PGHOST',
      database: 'PGDATABASE',
      password: 'PGPASSWORD',
      port: 'PGPORT',
    },
    hostname: 'PUBSWEET_HOSTNAME',
    baseUrl: 'PUBSWEET_BASEURL',
    secret: 'PUBSWEET_SECRET',
  },
  'pubsweet-client': {
    sha: 'CI_COMMIT_SHA',
  },
  meca: {
    apiKey: 'MECA_API_KEY',
  },
}
