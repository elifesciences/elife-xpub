const logger = require('@pubsweet/logger')
const { S3Storage } = require('@elifesciences/xpub-client')
const User = require('@elifesciences/component-model-user')
const Manuscript = require('@elifesciences/component-model-manuscript')
const File = require('@elifesciences/component-model-file')

const resolvers = {
  Query: {
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

    async deleteManuscript(_, { id }, { user }) {
      const userUuid = await User.getUuidForProfile(user)
      const manuscript = await Manuscript.find(id, userUuid)
      const files = await File.findByManuscriptId(id)
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
