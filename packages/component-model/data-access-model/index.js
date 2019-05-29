const BaseModel = require('@pubsweet/base-model')

class DataAccessModel extends BaseModel {
  async saveRecursively() {
    const relations = Object.keys(this.constructor.relationMappings)
    const strRelations = `[${relations.join(', ')}]`

    const incoming = relations.map(key => `${key} length= ${this[key].length}`)

    const options = {
      insert: true,
      relate: true,
      noDelete: true,
    }

    this.constructor.query().upsertGraph(this)
    const before = relations.map(key => `${key} length= ${this[key].length}`)

    // load
    await this.$loadRelated(strRelations)
    const after = relations.map(key => `${key} length= ${this[key].length}`)
    console.log(`
    ${this.constructor.name}
    ${incoming}
    ${before}
    ${after}
    `)
    return this
  }
}

module.exports = DataAccessModel
