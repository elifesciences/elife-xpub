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
  git: {
    sha: 'CI_COMMIT_SHA',
    ref: 'CI_COMMIT_REF_NAME',
  },
  elife: {
    api: {
      secret: 'ELIFE_API_GATEWAY_SECRET',
    },
  },
  meca: {
    sftp: {
      connectionOptions: {
        host: 'MECA_SFTP_HOST',
        port: 'MECA_SFTP_PORT',
        username: 'MECA_SFTP_USERNAME',
        password: 'MECA_SFTP_PASSWORD',
      },
      remotePath: 'MECA_SFTP_REMOTEPATH',
    },
    apiKey: 'MECA_API_KEY',
  },
  aws: {
    s3: {
      params: {
        Bucket: 'S3_BUCKET',
      },
    },
  },
  scienceBeam: {
    url: 'SCIENCEBEAM_URL',
  },
}
