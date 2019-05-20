const lodash = require('lodash')

module.exports = function hasMatchingEditors(suggested, opposed) {
  const suggestedIds = suggested.map(team => team.meta.elifePersonId)
  const opposedIds = opposed.map(team => team.meta.elifePersonId)

  return lodash.intersection(suggestedIds, opposedIds).length > 0
}
