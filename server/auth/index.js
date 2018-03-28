module.exports = {
  backend: () => require('./endpoint'),
  typeDefs: `
    extend type User {
      orcid: String
    }
  `,
}
