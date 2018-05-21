import config from 'config'

const authorDetails = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit`,
  firstNameField: '[name="submissionMeta.author.firstName"]',
  secondNameField: '[name="submissionMeta.author.lastName"]',
  emailField: '[name="submissionMeta.author.email"]',
  institutionField: '[name="submissionMeta.author.institution"]',
}

export default authorDetails
