const request = require('request-promise-native')
const { promisify } = require('util')
const xml2js = require('xml2js')

const parseString = promisify(xml2js.parseString)

async function extractSemantics(config, fileContents, filename, mimetype) {
  let title = ''
  const xmlBuffer = await request.post(config.get('scienceBeam.url'), {
    body: fileContents,
    qs: { filename },
    headers: { 'content-type': mimetype },
    timeout: config.get('scienceBeam.timeoutMs'),
  })
  const xmlData = await parseString(xmlBuffer.toString('utf8'))
  if (xmlData.article) {
    const firstArticle = xmlData.article.front[0]
    const articleMeta = firstArticle['article-meta']
    const firstMeta = articleMeta[0]
    const titleGroup = firstMeta['title-group']
    const firstTitleGroup = titleGroup[0]
    const titleArray = firstTitleGroup['article-title']
    title = titleArray[0]
  }

  return title
}

module.exports = {
  extractSemantics,
}
