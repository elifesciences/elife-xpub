const logger = require('@pubsweet/logger')
const mailer = require('@pubsweet/component-send-email')
const config = require('config')
const { Manuscript } = require('@elifesciences/xpub-model')

module.exports = app => {
  const apiKey = config.get('meca.apiKey')

  app.post('/meca-result/:id', (req, res) => {
    const manuscriptId = req.params.id
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.match(/Bearer (.+)/) && RegExp.$1

    if (token !== apiKey) {
      logger.warn('MECA callback received with invalid API key', {
        manuscriptId,
      })
      res.status(403).send({ error: 'Invalid API key' })
      return
    }

    const { body } = req
    if (!body || !['success', 'failure'].includes(body.result)) {
      logger.warn('MECA callback received with invalid request body', {
        manuscriptId,
        body,
      })
      res.status(400).send({ error: 'Invalid request body' })
      return
    }

    logger.info('MECA callback received', { manuscriptId, body })
    const status =
      body.result === 'success'
        ? Manuscript.statuses.MECA_IMPORT_SUCCEEDED
        : Manuscript.statuses.MECA_IMPORT_FAILED

    const updateStatus = () => Manuscript.updateStatus(manuscriptId, status)

    const sendEmail = () =>
      mailer
        .send({
          to: config.get('meca.email.recipient'),
          from: config.get('meca.email.sender'),
          subject: `${config.get(
            'meca.email.subjectPrefix',
          )}MECA import failed`,
          text: `
EJP failed to import MECA package.
Manuscript ID: ${manuscriptId}
EJP Body: ${body}
      `,
        })
        .catch(err => {
          throw new Error(`MECA import failure email failed to send. ${err}`)
        })

    updateStatus()
      .then(() => {
        if (status === Manuscript.statuses.MECA_IMPORT_FAILED) {
          return sendEmail()
        }
        return Promise.resolve()
      })
      .then(() => res.sendStatus(204))
      .catch(err => {
        logger.error('Failed to process MECA callback', {
          manuscriptId,
          error: err.message,
        })
        res.status(500).send({ error: err.message })
      })
  })
}
