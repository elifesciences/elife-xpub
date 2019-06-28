const initialize = ({ submission }) => ({
  execute: async (manuscriptId, userId) => {
    await submission.initialize(manuscriptId, userId)
    return submission.toJSON()
  },
})

module.exports = {
  initialize,
}
