const Joi = require('joi')
const pug = require('pug')
const dns = require('dns')
const util = require('util')
const mailer = require('@pubsweet/component-send-email')
const logger = require('@pubsweet/logger')

class Notification {
  constructor(config, people) {
    this.resolveMx = util.promisify(dns.resolveMx)
    this.people = people
    this.config = config
  }

  async isValidEmail(email) {
    let result = false
    try {
      await Joi.validate(
        email,
        Joi.string()
          .email()
          .required(),
      )
      const tld = email.split('@')[1]
      const lookup = await this.resolveMx(tld)
      result = lookup.length > 0
    } catch (err) {
      return false
    }

    return result
  }

  async sendDashboardEmail() {
    const emailList = this.people.map(person => person.alias.email).join(',')
    const valid = await this.people
      .map(async person => this.isValidEmail(person.alias.email))
      .reduce((previous, current) => previous && current)

    if (!valid) {
      return false
    }
    const textCompile = pug.compileFile('templates/dashboard-email-text.pug')
    const htmlCompile = pug.compileFile('templates/dashboard-email-html.pug')
    const firstNameList = this.people
      .map(person => person.alias.firstName)
      .join(',')

    const text = textCompile({
      authorName: firstNameList,
      linkDashboard: this.config.pubsweet.base_url,
    })
    const html = htmlCompile({
      authorName: firstNameList,
      linkDashboard: this.config.pubsweet.base_url,
    })

    let sent = false
    mailer
      .send({
        to: emailList,
        subject: 'Libero Submission System: New Submission',
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
}

module.exports = Notification
