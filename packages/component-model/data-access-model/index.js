const BaseModel = require('@pubsweet/base-model')
const { NotFoundError } = require('@pubsweet/errors')

const parseEagerRelations = relations =>
  Array.isArray(relations) ? `[${relations.join(', ')}]` : relations

class DataAccessModel extends BaseModel {
  async saveRecursively(trx = null) {
    return this.constructor
      .query()
      .upsertGraphAndFetch(this)
    this.getRelated...
      await this.$loadRelated('[teams, files]', null, trx)
  }
}

module.exports = DataAccessModel
