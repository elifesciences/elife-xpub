const { db } = require('@pubsweet/db-manager')

module.exports = async fullName => {
  const [result] = await db
    .select()
    .from('ejp_name')
    .whereRaw("lower(first || ' ' || last) = ?", [fullName.toLowerCase()])

  if (result) {
    return result.last
  }

  return fullName.substring(fullName.indexOf(' ') + 1)
}
