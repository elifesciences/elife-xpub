/* eslint-disable no-await-in-loop */
const config = require('config')
const logger = require('@pubsweet/logger')
const { cachedRequest } = require('./cached-request')

// Taken from journal-cms:
// sync/field.storage.node.field_person_type.yml
const validRoles = [
  'director',
  'early-career',
  'executive',
  'leadership',
  'reviewing-editor',
  'senior-editor',
]

const isValidRole = role => validRoles.indexOf(role) > 1

const convertPerson = apiPerson => {
  const { id, name, research = {}, emailAddresses, affiliations } = apiPerson
  const { focuses = [], expertises = [] } = research

  const affiliationString = affiliations
    ? affiliations.map(a => (a.name ? a.name.join(', ') : undefined)).join(', ')
    : undefined

  let person = {
    id,
    name: name.preferred,
    aff: affiliationString,
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
    let query = `order=asc&page=${page}&per-page=100`
    if (role) {
      role.split(',').forEach(r => {
        if (!isValidRole(r)) {
          const msg = `Invalid Role Querying the eLife API: ${r}`
          logger.error(msg)
          throw new TypeError(msg)
        }
        query += `&type[]=${r}`
      })
    }

    response = await cachedRequest('people', query)
    if (response.body.items) {
      items = items.concat(response.body.items)
    }
    page += 1
  } while (items.length < response.body.total)
  return !items || items.length === 0 ? [] : items.map(convertPerson)
}

const person = async id => {
  logger.debug('Fetching editor from /people', { id })
  const response = await cachedRequest(`people/${id}`)
  return convertPerson(response.body)
}

const peopleById = ids => Promise.all(ids.map(person))

const getEditorsByPersonId = async editorIds =>
  Promise.all(editorIds.map(id => person(id)))

const profile = async id => {
  logger.debug('Fetching profile with ID', id, 'from public API')
  return cachedRequest(`profiles/${id}`)
}

module.exports = {
  people,
  person,
  peopleById,
  profile,
  getEditorsByPersonId,
}
