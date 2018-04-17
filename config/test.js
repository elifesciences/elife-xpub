const { deferConfig } = require('config/defer')

module.exports = {
  'pubsweet-server': {
    port: 4000,
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    secret: 'test',
  },
  'auth-orcid': {
    clientID: '123',
    clientSecret: 'abc',
    sandbox: true,
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
