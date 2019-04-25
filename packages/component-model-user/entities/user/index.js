const BaseModel = require('@pubsweet/base-model')
const Identity = require('@elifesciences/component-model-identity')
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
        modelClass: Identity,
        join: {
          from: 'user.id',
          to: 'identity.userId',
        },
      },
    }
  }

  static async createWithIdentity(identifier, type = 'elife') {
    // TODO : should this be done in one transaction
    const user = await new User({ defaultIdentity: type }).save()
    await new Identity({
      type,
      identifier,
      userId: user.id,
    }).save()
    return user
  }

  static async findOrCreate(profileId) {
    let [user] = await User.query()
      // todo why does joinEager sometimes throw an error
      .joinRelation('identities')
      .where('identities.identifier', profileId)

    if (!user) {
      user = await User.createWithIdentity(profileId)
    }

    await user.extendWithApiData()
    return user
  }

  static async getProfileForUuid(uuid, idType = 'elife') {
    const [user] = await User.query().where('user.id', uuid)
    await user.$loadRelated('identities')
    let foundIdent = null
    if (user.identities) {
      foundIdent = user.identities.filter(ident => ident.type === idType)
    }
    return foundIdent ? foundIdent[0].identifier : null
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
    return super.save()
    // return this.$query().upsertGraphAndFetch(this)
  }
}

module.exports = User
