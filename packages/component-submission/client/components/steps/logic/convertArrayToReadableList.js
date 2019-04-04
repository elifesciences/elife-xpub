const convertArrayToReadableList = array => {
  if (!array || !array.length) return ''
  return `"${[array.slice(0, -1).join('", "'), array.slice(-1)[0]].join(
    array.length < 2 ? '' : '" and "',
  )}"`
}

export default convertArrayToReadableList
