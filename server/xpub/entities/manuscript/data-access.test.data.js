const dataAccess = require('./data-access')
const emptyManuscript = require('./helpers/empty')
const lodash = require('lodash')

const createSingleManuscript = async () => {
  const testId = await dataAccess.insert(emptyManuscript)
  return testId
}

const addManuscripts = async count => {
  const range = Array.from(Array(count).keys())
  const added = await Promise.all(
    range.map(async number => {
      const manu = lodash.cloneDeep(emptyManuscript)
      manu.meta.title = `Title ${number}`
      manu.createdBy = 'me'
      const id = await dataAccess.insert(manu)
      const result = await dataAccess.selectById(id)
      expect(result.id).toBe(id)
      return id
    }),
  )
  return added
}

module.exports = {
  createSingleManuscript,
  addManuscripts,
}
