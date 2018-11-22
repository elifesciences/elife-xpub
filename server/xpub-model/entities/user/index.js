const BaseModel = require('@pubsweet/base-model')
const api = require('./helpers/elife-api')

class User extends BaseModel {
  static get tableName() {
    return 'user'
  }

  static get schema() {
    return {
      required: [],
      properties: {
        defaultIdentity: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      identities: {
        relation: BaseModel.HasManyRelation,
        modelClass: `${__dirname}/../identity`,
        join: {
          from: 'user.id',
          to: 'identity.userId',
        },
      },
    }
  }

  static async findOrCreate(profileId) {
    let [user] = await User.query()
      // todo why does joinEager sometimes throw an error
      .joinRelation('identities')
      .where('identities.identifier', profileId)

    if (!user) {
      user = await new User({
        defaultIdentity: 'elife',
        identities: [{ type: 'elife', identifier: profileId }],
      }).save()
    }

    await user.extendWithApiData()
    return user
  }

  static async getUuidForProfile(profileId) {
    const [user] = await User.query()
      .joinRelation('identities')
      .where('identities.identifier', profileId)
    return user.id
  }

  async extendWithApiData() {
    await this.$loadRelated('identities')

    const { body } = await api.profile(this.identities[0].identifier)
    // TODO is splitting on the comma good enough?
    const [lastName, firstName] = body.name.index.split(', ', 2)

    Object.assign(this.identities[0], {
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
    })

    return this
  }

  async save() {
    return this.$query().upsertGraphAndFetch(this)
  }
}

module.exports = User
