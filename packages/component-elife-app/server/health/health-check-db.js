const checkDb = async db => {
  let response = ''
  try {
    response = await db.select('table_name').from('information_schema.tables')
  } catch (error) {
    return error.message
  }

  return response && response.length > 0 ? '' : 'no tables'
}

module.exports = checkDb
