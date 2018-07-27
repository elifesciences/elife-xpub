module.exports = {
  'pubsweet-server': {
    baseUrl: 'PUBSWEET_BASEURL',
    secret: 'PUBSWEET_SECRET',
  },
  'pubsweet-client': {
    sha: 'CI_COMMIT_SHA',
  },
  'pubsweet-server': {
    hostname: 'PUBSWEET_HOSTNAME',
  },
  'auth-orcid': {
    clientID: 'ORCID_CLIENT_ID',
    clientSecret: 'ORCID_CLIENT_SECRET',
  },
}
