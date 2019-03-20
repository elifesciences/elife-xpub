const Joi = require('joi')
const pug = require('pug')
const dns = require('dns')
const util = require('util')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')

const resolveMx = util.promisify(dns.resolveMx)

class Notification {
  constructor(config) {
    this.config = config
  }

  static async isValidEmail(email) {
    let result = false
    let tld = ''
    try {
      await Joi.validate(
        email,
        Joi.string()
          .email()
          .required(),
      )
      tld = email.split('@')[1]
      const lookup = await resolveMx(tld)
      result = lookup.length > 0
    } catch (err) {
      logger.warn(`Not a valid email or TLD: ${email}, ${err}`)
      return false
    }

    return result
  }

  async _sendEmail(people, htmlTemplate, txtTemplate, title) {
    const emailList = people.map(person => person.alias.email).join(',')
    const valid = await people
      .map(async person => Notification.isValidEmail(person.alias.email))
      .reduce((previous, current) => previous && current)

    if (!valid) {
      logger.warn(`Failed attempt to send email to: ${emailList}`)
      return false
    }

    const textCompile = pug.compileFile(txtTemplate)
    const htmlCompile = pug.compileFile(htmlTemplate)

    const firstNameList = people.map(person => person.alias.firstName).join(',')

    const text = textCompile({
      authorName: firstNameList,
      manuscriptTitle: title,
      linkDashboard: this.config['pubsweet-server'].baseUrl,
    })
    const html = htmlCompile({
      authorName: firstNameList,
      manuscriptTitle: title,
      linkDashboard: this.config['pubsweet-server'].baseUrl,
    })

    let sent = false
    mailer
      .send({
        to: emailList,
        subject: 'Your eLife submission',
        from: 'editorial@elifesciences.org',
        text,
        html,
      })
      .then(() => {
        logger.info(
          `Sent confirmation email to corresponding author: ${emailList}`,
        )
        sent = true
      })
      .catch(err => {
        logger.error(
          `Error sending corresponding author confirmation email: ${err}`,
        )
      })
    return sent
  }

  async sendDashboardEmail(people) {
    return this._sendEmail(
      people,
      'templates/dashboard-email-html.pug',
      'templates/dashboard-email-text.pug',
    )
  }

  async sendFinalSubmissionEmail(people, title) {
    return this._sendEmail(
      people,
      'templates/final-submission-email-html.pug',
      'templates/final-submission-email-text.pug',
      title,
    )
  }
}

module.exports = Notification
