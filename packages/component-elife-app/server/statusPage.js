const logger = require('@pubsweet/logger')
const getStatusPageData = require('./statusPageData')

const goodSymbol = '&#10004'
const badSymbol = '&#10008'
const disabledSymbol = '!'

const pageTitle = 'Application Status'
const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>${pageTitle}</title>
  </head>
  <body>
  <pre>
                 __
                / _)
       _.----._/ /
      /         /
   __/ (  | (  |
  /__.-'|_|--|_|

  Libero Reviewer

  Time: {time}
{contents}
  </pre>
  </body>
</html>
`

const addStatusLine = (component, state) => {
  const preline = `\n    `
  let line = `${goodSymbol} ${component}`
  if (state) {
    if (state === 'DISABLED') {
      line = `${disabledSymbol} ${component}`
    } else {
      logger.warn(`Status of ${component} returned ${JSON.stringify(state)}`)
      line = `${badSymbol} ${component}`
    }
  }
  return preline + line
}

const getStatusPage = async () => {
  let contents = ''
  const {
    generalError,
    dbResponse,
    s3Response,
    mecaResponse,
  } = await getStatusPageData()

  // General - any unexecpted exception
  contents += addStatusLine('General', generalError)
  // AWS-S3
  contents += addStatusLine('S3', s3Response)
  // Database
  contents += addStatusLine('Database', dbResponse)
  // Meca - sftp
  contents += addStatusLine('SFTP', mecaResponse)

  // TODO : Profiles Service, eLife API Gateway, Mailer and ScienceBeam

  const page = template
    .replace('{contents}', contents)
    .replace('{time}', new Date(Date.now()).toISOString())
  const noBadSymbol = page.search(badSymbol) === -1
  const code = noBadSymbol ? 200 : 500
  return { page, code }
}

module.exports = {
  getStatusPage,
  goodSymbol,
  badSymbol,
  disabledSymbol,
}
