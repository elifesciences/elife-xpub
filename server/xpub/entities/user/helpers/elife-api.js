/* eslint-disable no-await-in-loop */
const superagent = require('superagent')
const logger = require('@pubsweet/logger')

const apiRoot = 'https://api.elifesciences.org/'

// request data from orcid API
const request = (endpoint, query = {}) =>
  superagent.get(apiRoot + endpoint).query(query)

const convertPerson = apiPerson => ({
  id: apiPerson.id,
  name: apiPerson.name.preferred,
  aff: apiPerson.affiliations && apiPerson.affiliations[0].name[0],
  subjectAreas: apiPerson.research.expertises.map(e => e.name),
})

const people = async role => {
  logger.debug('Fetching people with role', role, 'from public API')
  let items = []
  let response
  let page = 1
  do {
    response = await request('people', {
      order: 'asc',
      page,
      'per-page': 100,
      type: role,
    })
    if (response.body.items) {
      items = items.concat(response.body.items)
    }
    page += 1
  } while (items.length < response.body.total)
  return !items || items.length === 0 ? [] : items.map(convertPerson)
}

const person = async id => {
  logger.debug('Fetching person with ID', id, 'from public API')
  const response = await request(`people/${id}`)
  return convertPerson(response.body)
}

const peopleById = ids => Promise.all(ids.map(person))

const profile = async id => {
  logger.debug('Fetching profile with ID', id, 'from public API')
  return request(`profiles/${id}`)
}

module.exports = {
  people,
  person,
  peopleById,
  profile,
}
