const convertArrayToReadableList = array =>
  `"${[array.slice(0, -1).join('", "'), array.slice(-1)[0]].join(
    array.length < 2 ? '' : '" and "',
  )}"`

export default convertArrayToReadableList
