const fs = require('fs-extra')

const placeholders = [
  'coverLetter',
  'opposedSeniorEditorsReason',
  'opposedReviewingEditorsReason',
  'opposedReviewersReason',
]

async function generateCoverLetter(manuscript) {
  const template = await fs.readFile(`${__dirname}/coverLetter.html`, 'utf8')
  return placeholders.reduce(
    (html, key) => html.replace(`{${key}}`, manuscript[key]),
    template,
  )
}

module.exports = generateCoverLetter
