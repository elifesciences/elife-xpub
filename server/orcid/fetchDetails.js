const superagent = require('superagent')

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
  const [emailResponse, empolymentsResponse] = await Promise.all([
    request(user, 'email'),
    request(user, 'employments'),
  ])

  const emails = emailResponse.body.email
  const email = emails.length ? emails[0].email : null

  const employments = empolymentsResponse.body['employment-summary']
  const institution = employments.length
    ? // sort by most recently ended
      employments
        .sort((a, b) => toDate(a['end-date']) - toDate(b['end-date']))
        .pop().organization
    : null

  return {
    email,
    institution,
  }
}
