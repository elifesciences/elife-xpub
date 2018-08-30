const { deferConfig } = require('config/defer')

module.exports = {
  'pubsweet-server': {
    db: {
      database: 'test',
      idleTimeoutMillis: 800, // Stops open handles in tests
    },
    port: 4000,
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    uploads: 'test/temp/uploads',
    secret: 'test',
  },
  'auth-orcid': {
    clientID: '123',
    clientSecret: 'abc',
    authorizationURL: 'http://localhost:8080/oauth/authorize',
    tokenURL: 'http://localhost:8080/oauth/token',
  },
  'orcid-server': {
    port: 8080,
  },
  darServer: {
    basePath: 'test/temp/uploads',
  },
  mailer: {
    transport: {
      sendmail: false,
      port: 1025,
      auth: {
        user: 'user',
        pass: 'pass',
      },
    },
  },
}
