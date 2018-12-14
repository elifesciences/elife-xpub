const lodash = require('lodash')
const { transaction } = require('objection')
const emptyManuscript = require('./helpers/empty')
const BaseModel = require('@pubsweet/base-model')

const integrityError = (property, value, message) =>
  new Error(
    `Data Integrity Error property ${property} set to ${value}: ${message}`,
  )

const mergeObjects = (...inputs) =>
  lodash.mergeWith(
    ...inputs,
    // always replace arrays instead of merging
    (objValue, srcValue) => {
      if (lodash.isArray(srcValue)) {
        return srcValue
      }
      return undefined
    },
  )

class Manuscript extends BaseModel {
  static get tableName() {
    return 'manuscript'
  }

  constructor(props) {
    super(lodash.merge({}, emptyManuscript, props))
  }

  static get schema() {
    return {
      required: ['createdBy'],
      properties: {
        createdBy: { type: 'uuid' },
        journalId: { type: 'uuid' },
        status: { type: 'string' },
        meta: {
          title: { type: 'string' },
          articleType: { type: 'string' },
          articleIds: { type: 'array' },
          abstract: { type: 'string' },
          subjects: { type: 'array' },
          notes: { type: 'array' },
        },
        previouslyDiscussed: { type: ['string', 'null'] },
        previouslySubmitted: { type: 'array' },
        cosubmission: { type: 'array' },
        suggestionsConflict: { type: 'boolean' },
        coverLetter: { type: 'string' },
        opposedSeniorEditorsReason: { type: 'string' },
        opposedReviewingEditorsReason: { type: 'string' },
        opposedReviewersReason: { type: 'string' },
        submitterSignature: { type: 'string' },
        disclosureConsent: { type: 'boolean' },
        lastStepVisited: { type: ['string', 'null'] },

        relatedManuscripts: { type: ['array', 'null'] },
        qcIssues: { type: ['array', 'null'] },
        decision: { type: ['string', 'null'] },
        previousVersion: { type: 'uuid' },
      },
    }
  }

  static get jsonAttributes() {
    // tell objection to serialise arrays as a postgres array rather than JSON
    return []
  }

  static get relationMappings() {
    return {
      files: {
        relation: BaseModel.HasManyRelation,
        modelClass: `${__dirname}/../file`,
        join: {
          from: 'manuscript.id',
          to: 'file.manuscriptId',
        },
      },
      teams: {
        relation: BaseModel.HasManyRelation,
        modelClass: `${__dirname}/../team`,
        join: {
          from: 'manuscript.id',
          to: 'team.objectId',
        },
      },
    }
  }

  static get statuses() {
    return {
      INITIAL: 'INITIAL',
      MECA_EXPORT_PENDING: 'MECA_EXPORT_PENDING',
      MECA_EXPORT_FAILED: 'MECA_EXPORT_FAILED',
      MECA_EXPORT_SUCCEEDED: 'MECA_EXPORT_SUCCEEDED',
      MECA_IMPORT_FAILED: 'MECA_IMPORT_FAILED',
      MECA_IMPORT_SUCCEEDED: 'MECA_IMPORT_SUCCEEDED',
    }
  }

  static get MAX_SUGGESTED_REVIEWERS() {
    return 6
  }
  static get MIN_SUGGESTED_REVIEWERS() {
    return 3
  }

  static async find(id, user) {
    const [manuscript] = await this.query().where({
      'manuscript.id': id,
      'manuscript.created_by': user,
    })

    if (!manuscript) {
      throw new Error(`${this.name} not found`)
    }
    // todo why does eager loading sometimes not work?
    await manuscript.$loadRelated('[teams, files]')

    return manuscript
  }

  static async findByStatus(status, user) {
    const manuscripts = await this.query().where({
      'manuscript.status': status,
      'manuscript.created_by': user,
    })
    // todo why do I need to do this?
    await Promise.all(
      manuscripts.map(manuscript => manuscript.$loadRelated('[teams, files]')),
    )
    return manuscripts
  }

  static async all(user) {
    const manuscripts = await this.query().where({
      'manuscript.created_by': user,
    })

    await Promise.all(
      manuscripts.map(manuscript => manuscript.$loadRelated('[teams, files]')),
    )
    return manuscripts
  }

  async refresh() {
    const refreshed = await Manuscript.find(this.id, this.createdBy)
    await this.$set(refreshed)
    await this.$loadRelated('[teams, files]')
  }

  async save() {
    const simpleSave = async () => {
      // save manuscript and all related files and teams
      // note that this also deletes any related entities that are not present
      await this.$query().upsertGraphAndFetch(this)
      // reload related entities
      await this.$loadRelated('[teams, files]')
    }

    if (this.created && this.updated) {
      let trx
      try {
        trx = await transaction.start(BaseModel.knex())

        const current = await this.constructor.query(trx).findById(this.id)

        const storedUpdateTime = new Date(current.updated).getTime()
        const instanceUpdateTime = new Date(this.updated).getTime()

        if (instanceUpdateTime < storedUpdateTime) {
          throw integrityError(
            'updated',
            this.updated,
            'is older than the one stored in the database!',
          )
        }
        await simpleSave()
        await trx.commit()
      } catch (err) {
        await trx.rollback()
        throw err
      }
    } else {
      await simpleSave()
    }
    return this
  }

  // atomically update the manuscript status
  static async updateStatus(id, status) {
    // Can't use objection's patch method as this overwrites existing data with defaults
    const updates = await this.knex()
      .table(this.tableName)
      .where({ id })
      .update({ status })
    if (updates === 0) {
      throw new Error(`${this.name} not found`)
    }
  }

  applyInput(input) {
    mergeObjects(
      this,
      lodash.pick(input, [
        'meta',
        'coverLetter',
        'opposedSeniorEditorsReason',
        'opposedReviewingEditorsReason',
        'previouslyDiscussed',
        'previouslySubmitted',
        'cosubmission',
        'opposedReviewersReason',
        'suggestionsConflict',
        'submitterSignature',
        'disclosureConsent',
      ]),
    )

    // reshape suggested editors into teams
    const editorSuggestionRoles = [
      'suggestedSeniorEditor',
      'opposedSeniorEditor',
      'suggestedReviewingEditor',
      'opposedReviewingEditor',
    ]
    const editorSuggestionTeams = editorSuggestionRoles.map(role => {
      const key = `${role}s`
      const suggestedEditorIds = input[key] || []
      const teamMembers = suggestedEditorIds.map(id => ({
        meta: { elifePersonId: id },
      }))
      return { role, teamMembers }
    })

    // reshape suggested reviewers into teams
    const reviewerSuggestionRoles = ['suggestedReviewer', 'opposedReviewer']
    const reviewerSuggestionTeams = reviewerSuggestionRoles.map(role => {
      const key = `${role}s`
      const suggestedReviewerAliases = input[key] || []
      const teamMembers = suggestedReviewerAliases.map(meta => ({ meta }))
      return { role, teamMembers }
    })

    // move author into team
    const authorTeam = {
      role: 'author',
      teamMembers: [{ alias: input.author, meta: { corresponding: true } }],
    }

    editorSuggestionTeams
      .concat(reviewerSuggestionTeams)
      .concat(authorTeam)
      .forEach(team => this.addTeam(team))

    return this
  }

  setDefaults() {
    // add defaults only when a manuscript is first created,
    // not every time an object is instantiated
    this.addTeam({
      role: 'suggestedReviewer',
      teamMembers: [
        { meta: { name: '', email: '' } },
        { meta: { name: '', email: '' } },
        { meta: { name: '', email: '' } },
      ],
    })
  }

  addTeam(team) {
    const index = this.teams.findIndex(t => t.role === team.role)
    // make sure object type is set for teams
    if (index >= 0) {
      Object.assign(this.teams[index], { objectType: 'manuscript' }, team)
    } else {
      this.teams.push(Object.assign({ objectType: 'manuscript' }, team))
    }
  }

  // todo this makes more sense as an instance method but that
  // would mean applying the input to the manuscript first
  static removeOptionalBlankReviewers(input) {
    const itemIsBlank = item => item.name + item.email === ''

    const filteredReviewers = input.suggestedReviewers.filter(
      (item, index) =>
        index < Manuscript.MIN_SUGGESTED_REVIEWERS || !itemIsBlank(item),
    )

    return { ...input, suggestedReviewers: filteredReviewers }
  }

  getAuthor() {
    const authorTeam = this.teams.find(t => t.role === 'author')
    if (!authorTeam) {
      return null
    }
    return authorTeam.teamMembers
  }

  getSource() {
    return this.files.find(file => file.type === 'MANUSCRIPT_SOURCE')
  }
}

module.exports = Manuscript
