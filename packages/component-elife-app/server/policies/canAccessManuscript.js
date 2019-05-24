module.exports = (userId, operation, request, context) => {
  const { Manuscript } = context.models

  // There must be a more elegant way of doing this
  // We should probably aim to move towards using Option types
  return Manuscript.findById(request.manuscriptId)
    .then(manuscript => manuscript.createdBy === userId)
    .catch(() => false)
}
