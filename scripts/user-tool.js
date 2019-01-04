const superagent = require('superagent')

const profilesRoot = 'https://prod--gateway.elifesciences.org'
const orcidRoot = 'https://sandbox.orcid.org'
const orcidRootApi = 'https://api.sandbox.orcid.org/v2.1'

const getOrcidAccessToken = async () => {
  const clientId = process.env.ORCID_CLIENTID || ''
  const secret = process.env.ORCID_SECRET || ''

  const result = await superagent
    .post(`${orcidRoot}/oauth/token`)
    .set('Accept', 'application/json')
    .send(`client_id=${clientId}`)
    .send(`client_secret=${secret}`)
    .send(`grant_type=client_credentials`)
    .send(`scope=/read-public`)
    .catch(err => {
      console.error('Failed to oauth')
      console.error(JSON.stringify(err, null, 4))
      throw err
    })
  return result.body.access_token
}

// request data from orcid API
const requestOrcid = async (token, orcid, endpoint) => {
  const url = `${orcidRootApi}/${orcid}/${endpoint}`
  const req = superagent
    .get(url)
    .set('Accept', 'application/vnd.orcid+json')
    .set('Authorization', `Bearer ${token}`)
  const result = await req.query().catch(err => {
    console.error('Failed to fetch from:', url, err.message, err.stack)
    console.error(err.response.text)
    throw err
  })
  return result.body
}

const request = async (url, query = {}, secret = null) => {
  const req = superagent.get(url)

  if (secret) {
    req.header.Authorization = secret
  }
  const result = await req.query(query).catch(err => {
    console.error('Failed to fetch from:', url, err.message, err.stack)
    throw err
  })
  return result
}

const allPages = async url => {
  let items = []
  let page = 1
  const perPage = 100
  const response = await request(url, {
    order: 'asc',
    page,
    'per-page': perPage,
  })

  if (response.body.items) {
    items = items.concat(response.body.items)
  }

  // now figure out how many more pages to get
  const numPages = Math.ceil(response.body.total / perPage) - 1

  const promises = Array.apply(0, Array(numPages)).map(() => {
    page += 1
    return request(url, {
      order: 'asc',
      page,
      'per-page': perPage,
    })
  })

  await Promise.all(promises).then(
    values => {
      values.forEach(resp => {
        if (resp.body.items) {
          items = items.concat(resp.body.items)
        }
      })
    },
    reason => {
      console.error(reason)
    },
  )

  return !items || items.length === 0 ? [] : items
}

const allProfiles = async () => {
  const profiles = await allPages(`${profilesRoot}/profiles`)
  profiles.forEach(item => {
    console.log(`${item.id}, "${item.name.index}", ${item.orcid}`)
  })
}

const getProfile = async profileId => {
  const secret = process.env.ELIFE_API_GATEWAY_SECRET || ''
  const profile = await request(
    `${profilesRoot}/profiles/${profileId}`,
    {},
    secret,
  )
  console.log(profile.body)
}

const getOrcid = async orcidId => {
  const token = await getOrcidAccessToken()

  const [personResponse, employmentsResponse] = await Promise.all([
    requestOrcid(token, orcidId, 'person'),
    requestOrcid(token, orcidId, 'employments'),
  ])

  console.log(JSON.stringify(personResponse, null, 4))
  console.log(JSON.stringify(employmentsResponse, null, 4))
}

/**
 *
 */
if (require.main === module) {
  const arg = process.argv.length > 2 ? process.argv[2] : 'profiles'
  const arg1 = process.argv.length > 3 ? process.argv[3] : null

  if (arg === 'profiles') {
    allProfiles()
  } else if (arg === 'get-profile' && arg1) {
    getProfile(arg1)
  } else if (arg === 'get-orcid' && arg1) {
    getOrcid(arg1)
  }
}
