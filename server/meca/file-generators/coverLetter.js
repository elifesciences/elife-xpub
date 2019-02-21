const fs = require('fs-extra')
const pdf = require('html-pdf')

const placeholders = ['coverLetter']

async function toPdf(html) {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer)
      }
    })
  })
}

async function generateCoverLetter(manuscript) {
  const template = await fs.readFile(
    `${__dirname}/templates/coverLetter.html`,
    'utf8',
  )
  const htmlContents = placeholders.reduce(
    (html, key) => html.replace(`{${key}}`, manuscript[key]),
    template,
  )

  return toPdf(htmlContents)
}

module.exports = generateCoverLetter
