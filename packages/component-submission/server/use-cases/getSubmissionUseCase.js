const initialize = ({ submissionAggregate }) => ({
  execute: async (manuscriptId, userId) => {
    const submission = await submissionAggregate.initialize(
      manuscriptId,
      userId,
    )
    return submission.toJSON()
  },
})

module.exports = {
  initialize,
}
