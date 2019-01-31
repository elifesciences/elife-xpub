const BaseModel = require('@pubsweet/base-model')
const { Manuscript } = require('@elifesciences/xpub-model')
const AuditLog = require('../auditLog')

class File extends BaseModel {
  static get tableName() {
    return 'file'
  }

  static get schema() {
    return {
      properties: {
        manuscriptId: { type: 'uuid' },
        filename: { type: 'string' },
        label: { type: ['string', 'null'] },
        type: { type: ['string', 'null'] },
        mimeType: { type: ['string', 'null'] },
        size: { type: ['string', 'null'] },
        url: { type: 'string' },
        status: {
          type: 'string',
          enum: ['CREATED', 'UPLOADED', 'STORED', 'CANCELLED'],
          default: 'CREATED',
        },
      },
    }
  }

  async save() {
    await this.$query().upsertGraphAndFetch(this)

    const manuscript = await Manuscript.find(this.manuscriptId)

    if (!manuscript) {
      throw new Error(
        `Unable to find Manuscript of ID: ${
          this.manuscriptId
        } assigned to File: ${this.id}`,
      )
    }

    await manuscript.validate()
    return this
  }

  async updateStatus(status) {
    this.status = status

    await new AuditLog({
      action: 'UPDATED',
      objectId: this.id,
      objectType: 'file.status',
      value: status,
    }).save()

    return this.save()
  }

  static async findByManuscriptId(manuscriptId) {
    const files = await this.query().where({
      manuscript_id: manuscriptId,
    })
    if (!files) {
      throw new Error(`file with manuscript_id ${manuscriptId} not found`)
    }
    return files
  }
}

module.exports = File
