const IdentityManager = require('../identity')
const dataAccess = require('./data-access')
const api = require('./helpers/elife-api')

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
    try {
      return await dataAccess.selectByProfileId(profileId)
    } catch (err) {
      if (err.message !== 'User not found') {
        throw err
      }

      const dbUser = await UserManager.save({
        defaultIdentity: 'elife',
        identities: [{ type: 'elife', identifier: profileId }],
      })

      return UserManager.extendWithApiData(dbUser)
    }
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
          email: body.emailAddresses.length
            ? body.emailAddresses[0].value
            : null,
          displayName: body.name.preferred,
          meta: {
            firstName,
            lastName,
            orcid: body.orcid,
            affiliation: body.affiliations.length
              ? body.affiliations[0].value.name.join(', ')
              : null,
          },
        },
      ],
    }
  },
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
