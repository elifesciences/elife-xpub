const lodash = require('lodash')
const { transaction } = require('objection')
const BaseModel = require('@pubsweet/base-model')
const logger = require('@pubsweet/logger')
const emptyManuscript = require('./helpers/empty')
const AuditLog = require('@elifesciences/component-model-audit-log').model

// Temporarily commented out see #1162
// const integrityError = (property, value, message) =>
//   new Error(
//     `Data Integrity Error property ${property} set to ${value}: ${message}`,
//   )

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
        modelClass: require('@elifesciences/component-model-file').model,
        join: {
          from: 'manuscript.id',
          to: 'file.manuscriptId',
        },
      },
      teams: {
        relation: BaseModel.HasManyRelation,
        modelClass: require('@elifesciences/component-model-team').model,
        join: {
          from: 'manuscript.id',
          to: 'team.objectId',
        },
      },
    }
  }

  get fileStatus() {
    const FILE_STATUSES = [
      {
        uploadStatuses: ['STORED', 'CANCELLED'],
        isReady: true,
      },
      {
        uploadStatuses: ['UPLOADED', 'CREATED'],
        isReady: false,
      },
    ]
    const logObject = this.files.map(file => ({
      id: file.id,
      type: file.type,
      status: file.status,
      name: file.filename,
    }))

    logger.info(
      `get fileStatus(): ${logObject.length} ${JSON.stringify(logObject)}`,
    )

    const result = this.files
      .map(
        file =>
          FILE_STATUSES.find(fs => fs.uploadStatuses.includes(file.status))
            .isReady,
      )
      .every(status => status)
      ? 'READY'
      : 'CHANGING'

    logger.info(`get fileStatus(): =${result}`)
    return result
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
      manuscripts.map(manuscript => manuscript.$loadRelated('[teams, files ]')),
    )
    return manuscripts
  }

  static async all(user) {
    const manuscripts = await this.query()
      .where({
        'manuscript.created_by': user,
      })
      .orderBy('updated', 'desc')

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

  async needsRefresh(trx = null) {
    const current = await this.constructor.query(trx).findById(this.id)

    const storedUpdateTime = new Date(current.updated).getTime()
    const instanceUpdateTime = new Date(this.updated).getTime()

    return instanceUpdateTime < storedUpdateTime
  }

  async save() {
    const simpleSave = async (trx = null) => {
      // save manuscript and all relations
      // note that this also deletes any related entities that are not present
      await this.$query(trx).upsertGraphAndFetch(this)
      // reload related entities
      await this.$loadRelated('[teams, files]', null, trx)
    }

    if (this.created && this.updated) {
      let trx
      try {
        trx = await transaction.start(BaseModel.knex())

        if (await this.needsRefresh(trx)) {
          logger.error(
            `Attempt to save Manuscript ${this.id} with updated=${
              this.updated
            }`,
          )
          // Temporarily commented out see #1162
          // throw integrityError(
          //   'updated',
          //   this.updated,
          //   'is older than the one stored in the database!',
          // )
        }

        await simpleSave(trx)
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

  static async updateStatus(id, status) {
    const [manuscript] = await this.query().where({
      'manuscript.id': id,
    })

    if (!manuscript) {
      throw new Error(`${this.name} not found`)
    }
    // todo why does eager loading sometimes not work?
    await manuscript.$loadRelated('[teams, files]')

    manuscript.status = status

    await new AuditLog({
      action: 'UPDATED',
      objectId: id,
      objectType: 'manuscript.status',
      value: status,
    }).save()

    return manuscript.save()
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

    const findMatching = (arr1 = [], arr2 = []) =>
      arr1.some(item => arr2.includes(item))

    const matchingSenior = findMatching(
      input.suggestedSeniorEditors,
      input.opposedSeniorEditors,
    )

    const matchingReviewing = findMatching(
      input.suggestedReviewingEditors,
      input.opposedReviewingEditors,
    )
    if (matchingSenior || matchingReviewing) {
      throw new Error(`Same editor has been suggested and oppesed`)
    }

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
      teamMembers: [{ meta: { name: '', email: '' } }],
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
      item => !itemIsBlank(item),
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
