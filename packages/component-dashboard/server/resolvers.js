const logger = require('@pubsweet/logger')
const { S3Storage } = require('@elifesciences/component-service-s3')
const models = require('@pubsweet/models')

const resolvers = {
  Query: {
    async manuscripts(_, vars, { user }) {
      const userUuid = await models.User.getUuidForProfile(user)
      return models.Manuscript.all(userUuid)
    },
  },

  Mutation: {
    async createManuscript(_, vars, { user }) {
      if (!user) {
        throw new Error('Not logged in')
      }
      const userUuid = await models.User.getUuidForProfile(user)
      const manuscript = models.Manuscript.makeInitial({ createdBy: userUuid })
      manuscript.setDefaults()
      return manuscript.save()
    },

    async deleteManuscript(_, { id }, { user }) {
      const userUuid = await models.User.getUuidForProfile(user)
      const manuscript = await models.Manuscript.find(id, userUuid)
      const files = await models.File.findByManuscriptId(id)
      if (files) {
        try {
          await files.forEach(file => {
            S3Storage.deleteContent(file)
            file.delete()
          })
        } catch (error) {
          logger.error(error)
        }
      }

      await manuscript.delete()
      return id
    },
  },
}

module.exports = resolvers
