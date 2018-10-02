module.exports = {
  'pubsweet-server': {
    db: {
      user: 'PGUSER',
      host: 'PGHOST',
      database: 'PGDATABASE',
      password: 'PGPASSWORD',
    },
    hostname: 'PUBSWEET_HOSTNAME',
    baseUrl: 'PUBSWEET_BASEURL',
    secret: 'PUBSWEET_SECRET',
  },
  'pubsweet-client': {
    sha: 'CI_COMMIT_SHA',
  },
}
