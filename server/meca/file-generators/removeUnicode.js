const removeUnicode = (str, index) => {
  let newStr = str.replace(/[^\x00-\x7F]/g, '')
  if (newStr !== str) {
    newStr = `${index}_${newStr}`
  }
  return newStr
}

module.exports = removeUnicode
