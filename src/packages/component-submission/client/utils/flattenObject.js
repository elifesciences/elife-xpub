import { forEach, isObject } from 'lodash'

function flattenObject(object) {
  const result = {}

  function flatten(obj, prefix = '') {
    forEach(obj, (value, key) => {
      if (isObject(value)) {
        flatten(value, `${prefix}${key}.`)
      } else {
        result[`${prefix}${key}`] = value
      }
    })
  }

  flatten(object)

  return result
}

export default flattenObject
