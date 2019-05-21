const { mergeWith, isArray, clone } = require('lodash')

// In future this might want to live outside of this bounded context
module.exports = function mergeObjects(source, ...inputs) {
  return mergeWith(
    clone(source),
    ...inputs,
    // always replace arrays instead of merging
    (objValue, srcValue) => {
      if (isArray(srcValue)) {
        return srcValue
      }
      return undefined
    },
  )
}
