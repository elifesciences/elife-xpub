const dataAccess = require('./data-access')

const User = {
  find: dataAccess.selectById,
  save: async user => {
    if (user.id) {
      await dataAccess.update(user)
      return user
    }

    const id = await dataAccess.insert(user)
    return { ...user, id }
  },
}

module.exports = User
