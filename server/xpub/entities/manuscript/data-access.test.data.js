const emptyManuscript = require('./helpers/empty')
const lodash = require('lodash')

const initialize = async dataAccess => {
  const testId = await dataAccess.insert(emptyManuscript)
  return testId
}

const addManuscripts = async (dataAccess, count) => {
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

const getBlankManuscript = () => lodash.cloneDeep(emptyManuscript)

module.exports = {
  initialize,
  addManuscripts,
  getBlankManuscript,
}
