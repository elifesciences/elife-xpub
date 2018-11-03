const IdentityManager = require('../identity')
const dataAccess = require('./data-access')
const api = require('./helpers/elife-api')

// TODO: Store these in config?
const adminUsers = [{ orcid: '0001-0002-0003-0004', lastName: 'Last' }]

const UserManager = {
  find: async uuid => {
    const dbUser = await dataAccess.selectById(uuid)
    return UserManager.extendWithApiData(dbUser)
  },
  findByProfileId: async profileId => {
    const dbUser = await dataAccess.selectByProfileId(profileId)
    return UserManager.extendWithApiData(dbUser)
  },
  findOrCreate: async profileId => {
    let dbUser
    try {
      dbUser = await dataAccess.selectByProfileId(profileId)
    } catch (err) {
      if (err.message !== 'User not found') {
        throw err
      }

      dbUser = await UserManager.save({
        defaultIdentity: 'elife',
        identities: [{ type: 'elife', identifier: profileId }],
      })
    }
    return UserManager.extendWithApiData(dbUser)
  },
  isAdmin: async uuid => {
    const userData = await UserManager.find(uuid)
    const { orcid, lastName } = userData.identities[0].meta

    return adminUsers.find(u => u.lastName === lastName && u.orcid === orcid)
  },
  getUuidForProfile: async profileId => {
    const dbUser = await dataAccess.selectByProfileId(profileId)
    return dbUser.id
  },
  extendWithApiData: async user => {
    const { body } = await api.profile(user.identities[0].identifier)
    // TODO is splitting on the comma good enough?
    const [lastName, firstName] = body.name.index.split(', ', 2)
    return {
      ...user,
      identities: [
        {
          ...user.identities[0],
          email: body.emailAddresses.length ? body.emailAddresses[0].value : '',
          name: body.name.preferred,
          aff: body.affiliations.length
            ? body.affiliations[0].value.name.join(', ')
            : '',
          meta: {
            firstName,
            lastName,
            orcid: body.orcid,
          },
        },
      ],
    }
  },
  getEditorsByPersonId: api.peopleById,
  save: async user => {
    let id = { user }
    if (user.id) {
      const updated = await dataAccess.update(user)
      if (!updated) {
        throw new Error('User not found')
      }
    } else {
      id = await dataAccess.insert(user)
    }

    if (user.identities) {
      await Promise.all(
        user.identities.map(identity =>
          IdentityManager.save({ ...identity, userId: id }),
        ),
      )
    }

    return { ...user, id }
  },
}

module.exports = UserManager
