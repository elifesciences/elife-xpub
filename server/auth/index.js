module.exports = {
  backend: () => require('./orcid'),
  typeDefs: `
    extend type User {
      orcid: String
    }
  `,
}
