/* eslint-disable no-await-in-loop */
const superagent = require('superagent')
const config = require('config')
const logger = require('@pubsweet/logger')

const apiRoot = config.get('server.api.url')

const request = (endpoint, query = {}) => {
  const req = superagent.get(apiRoot + endpoint)
  // only had the header if its defined in config
  const secret = config.get('server.api.secret')
  if (secret) {
    req.header.Authorization = secret
  }
  return req.query(query)
}

const convertPerson = apiPerson => {
  let person = {
    id: apiPerson.id,
    name: apiPerson.name.preferred,
    aff: apiPerson.affiliations && apiPerson.affiliations[0].name[0],
    subjectAreas: (apiPerson.research.expertises || [])
      .map(e => e.name)
      .concat(apiPerson.research.focuses || []),
    surname: apiPerson.name.surname,
    firstname: apiPerson.name.givenNames,
  }
  // if we used a secret then pull out the email too
  if (config.get('server.api.secret') && apiPerson.emailAddresses) {
    const email = apiPerson.emailAddresses.length
      ? apiPerson.emailAddresses[0].value
      : ''

    person = {
      ...person,
      email,
    }
  }
  return person
}

const people = async role => {
  logger.debug('Fetching editors from /people', { role })
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
  logger.debug('Fetching editor from /people', { id })
  const response = await request(`people/${id}`)
  return convertPerson(response.body)
}

const peopleById = ids => Promise.all(ids.map(person))

const getEditorsByPersonId = async editorIds => {
  const list = await Promise.all(editorIds.map(id => person(id)))
  return list
}

const profile = async id => {
  logger.debug('Fetching profile with ID', id, 'from public API')
  return request(`profiles/${id}`)
}

module.exports = {
  people,
  person,
  peopleById,
  profile,
  getEditorsByPersonId,
}
