const superagent = require('superagent')

class ApiHelper {
  static async request(url, query = {}, secret = null) {
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

  static async allPages(url) {
    let items = []
    let page = 1
    const perPage = 100
    const response = await ApiHelper.request(url, {
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
      return ApiHelper.request(url, {
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
}
class UserTool {
  constructor(config) {
    this.profilesRoot = config.profilesRoot
    this.orcidRoot = config.orcidRoot
    this.orcidRootApi = config.orcidRootApi
  }

  async getOrcidAccessToken() {
    const clientId = process.env.ORCID_CLIENTID || ''
    const secret = process.env.ORCID_SECRET || ''

    const result = await superagent
      .post(`${this.orcidRoot}/oauth/token`)
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
  async requestOrcid(token, orcid, endpoint) {
    const url = `${this.orcidRootApi}/${orcid}/${endpoint}`
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

  async allProfiles() {
    const profiles = await ApiHelper.allPages(`${this.profilesRoot}/profiles`)
    profiles.forEach(item => {
      console.log(`${item.id}, "${item.name.index}", ${item.orcid}`)
    })
  }

  async getProfile(profileId) {
    const secret = process.env.ELIFE_API_GATEWAY_SECRET || ''
    const profile = await ApiHelper.request(
      `${this.profilesRoot}/profiles/${profileId}`,
      {},
      secret,
    )
    console.log(profile.body)
  }

  async getOrcid(orcidId) {
    const token = await this.getOrcidAccessToken()

    const [personResponse, employmentsResponse] = await Promise.all([
      this.requestOrcid(token, orcidId, 'person'),
      this.requestOrcid(token, orcidId, 'employments'),
    ])

    console.log(JSON.stringify(personResponse, null, 4))
    console.log(JSON.stringify(employmentsResponse, null, 4))
  }
}

/**
 *
 */
if (require.main === module) {
  let sandbox = false
  const args = process.argv.splice(2).filter(value => {
    const settingSandbox = value.toLowerCase() === '-s'
    if (settingSandbox) {
      sandbox = true
    }
    return !settingSandbox
  })

  const arg = args.length ? args[0] : 'profiles'
  const arg1 = args.length > 1 ? args[1] : null

  const sandboxConfig = {
    profilesRoot: 'https://continuumtest--gateway.elifesciences.org',
    orcidRoot: 'https://sandbox.orcid.org',
    orcidRootApi: 'https://api.sandbox.orcid.org/v2.1',
  }

  const liveConfig = {
    profilesRoot: 'https://prod--gateway.elifesciences.org',
    orcidRoot: 'https://orcid.org',
    orcidRootApi: 'https://api.orcid.org/v2.1',
  }

  const tool = new UserTool(sandbox ? sandboxConfig : liveConfig)

  if (arg === 'profiles') {
    tool.allProfiles()
  } else if (arg === 'get-profile' && arg1) {
    tool.getProfile(arg1)
  } else if (arg === 'get-orcid' && arg1) {
    tool.getOrcid(arg1)
  }
}
