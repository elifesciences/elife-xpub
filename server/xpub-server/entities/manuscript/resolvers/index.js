const logger = require('@pubsweet/logger')
const { Manuscript, User } = require('@elifesciences/xpub-model')
const removeUploadedManuscript = require('./removeUploadedManuscript')
const submitManuscript = require('./submitManuscript')
const updateManuscript = require('./updateManuscript')
const uploadManuscript = require('./uploadManuscript')

const resolvers = {
  Query: {
    async manuscript(_, { id }, { user }) {
      const userUuid = await User.getUuidForProfile(user)
      return Manuscript.find(id, userUuid)
    },
    async manuscripts(_, vars, { user }) {
      const userUuid = await User.getUuidForProfile(user)
      return Manuscript.all(userUuid)
    },
  },

  Mutation: {
    async createManuscript(_, vars, { user }) {
      if (!user) {
        throw new Error('Not logged in')
      }
      const userUuid = await User.getUuidForProfile(user)
      const manuscript = new Manuscript({ createdBy: userUuid })
      manuscript.setDefaults()
      return manuscript.save()
    },

    // TODO restrict this in production
    async deleteManuscript(_, { id }, { user }) {
      const userUuid = await User.getUuidForProfile(user)
      const manuscript = await Manuscript.find(id, userUuid)
      await manuscript.delete()
      return id
    },

    updateManuscript,

    submitManuscript,

    uploadManuscript,

    removeUploadedManuscript,

    async savePage(_, vars, { user }) {
      const userUuid = await User.getUuidForProfile(user)
      const manuscript = await Manuscript.find(vars.id, userUuid)

      manuscript.formState = vars.url
      await manuscript.save()
      logger.debug(`Updated manuscript`, {
        manuscriptId: vars.id,
        userId: userUuid,
        formState: vars.url,
      })

      return manuscript
    },
  },

  Manuscript: {
    async author(manuscript) {
      const team = manuscript.teams.find(t => t.role === 'author')
      if (!team) return { firstName: '', lastName: '', email: '', aff: '' }
      return team.teamMembers[0].alias
    },

    async clientStatus(manuscript) {
      let clientStatus = ''

      switch (manuscript.status) {
        case 'INITIAL':
          clientStatus = 'CONTINUE_SUBMISSION'
          break
        case 'MECA_EXPORT_PENDING':
        case 'MECA_EXPORT_FAILED':
        case 'MECA_EXPORT_SUCCEEDED':
        case 'MECA_IMPORT_FAILED':
        case 'MECA_IMPORT_SUCCEEDED':
          clientStatus = 'SUBMITTED'
          break
        default:
          throw new Error(`Unhandled manuscript status ${manuscript.status}`)
      }

      return clientStatus
    },

    async assignees(manuscript, { role }) {
      const team = manuscript.teams.find(t => t.role === role)
      if (!team) return []

      switch (role) {
        case 'suggestedSeniorEditor':
        case 'opposedSeniorEditor':
        case 'suggestedReviewingEditor':
        case 'opposedReviewingEditor': {
          const assigneeIds = team.teamMembers.map(
            member => member.meta.elifePersonId,
          )
          return User.getEditorsByPersonId(assigneeIds)
        }
        case 'suggestedReviewer':
        case 'opposedReviewer':
          return team.teamMembers.map(member => member.meta)

        default:
          throw new Error(`Unhandled role type ${role}`)
      }
    },
  },

  Assignee: {
    __resolveType: assignee => {
      if (assignee.subjectAreas !== undefined) return 'EditorAlias'
      if (assignee.name !== undefined) return 'ReviewerAlias'
      if (assignee.firstName !== undefined) return 'AuthorAlias'
      return null
    },
  },
}

module.exports = resolvers
