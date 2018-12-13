module.exports = {
  transport: {
    host: `${process.env.MAILER_HOST || 'localhost'}`,
    port: `${process.env.MAILER_PORT || 25}`,
    auth: JSON.parse(`${process.env.MAILER_AUTH || '{}'}`),
  },
}
