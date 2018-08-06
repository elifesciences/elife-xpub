const superagent = require('superagent')
const _ = require('lodash')
const logger = require('@pubsweet/logger')

const apiRoot = 'https://api.sandbox.orcid.org/v2.1'

// request data from orcid API
const request = (user, endpoint) =>
  superagent
    .get(`${apiRoot}/${user.orcid}/${endpoint}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${user.oauth.accessToken}`)

// convert API date object into Date
const toDate = date => {
  if (date === null) return new Date()

  const year = date.year.value
  const month = parseInt((date.month && date.month.value) || '1', 10) - 1
  const day = (date.day && date.day.value) || 1
  return new Date(year, month, day)
}

module.exports = async user => {
  logger.debug('processing response from orcid api')
  const [personResponse, employmentsResponse] = await Promise.all([
    request(user, 'person'),
    request(user, 'employments'),
  ])

  const firstName = _.get(personResponse, 'body.name.given-names.value')
  const lastName = _.get(personResponse, 'body.name.family-name.value')
  const email = _.get(personResponse, 'body.emails.email[0].email')

  const employments = _.get(employmentsResponse, 'body.employment-summary')
  const aff = employments.length
    ? // sort by most recently ended
      employments
        .sort((a, b) => toDate(a['end-date']) - toDate(b['end-date']))
        .pop().organization.name
    : null

  logger.debug(`fetchUserDetails returning:
    first: ${firstName},
    last: ${lastName}
    email: ${email},
    aff: ${aff}`)
  return {
    firstName,
    lastName,
    email,
    aff,
  }
}
