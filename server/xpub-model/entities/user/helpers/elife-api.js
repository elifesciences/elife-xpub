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
  return req.query(query).catch(err => {
    logger.error('Failed to fetch from eLife API:', err.message)
    throw err
  })
}

const convertPerson = apiPerson => {
  const { id, name, research = {}, emailAddresses, affiliations } = apiPerson
  const { focuses = [], expertises = [] } = research

  let person = {
    id,
    name: name.preferred,
    aff: affiliations ? affiliations[0].name[0] : undefined,
    focuses,
    expertises: expertises.map(expertise => expertise.name) || [],
    surname: name.surname,
    firstname: name.givenNames,
  }
  // if we used a secret then pull out the email too
  if (config.get('server.api.secret') && emailAddresses) {
    const email = emailAddresses.length ? emailAddresses[0].value : ''

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

const getEditorsByPersonId = async editorIds =>
  Promise.all(editorIds.map(id => person(id)))

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
