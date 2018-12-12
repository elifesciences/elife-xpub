module.exports = {
  transport: {
    host: `${process.env.MAILER_HOST || 'localhost'}`,
    port: `${process.env.MAILER_PORT || 25}`,
  },
  auth: {
    user: `${process.env.MAILER_AUTH_USER || ''}`,
    pass: `${process.env.MAILER_AUTH_PASSWORD || ''}`,
  },
}
