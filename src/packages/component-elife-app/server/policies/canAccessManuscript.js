module.exports = (userId, operation, request, context) => {
  const { Manuscript } = context.models
  // TODO: We're going to move this file and it's tests to somewhere else

  // There must be a more elegant way of doing this
  // We should probably aim to move towards using Option types
  return Manuscript.findById(request.manuscriptId)
    .then(manuscript => manuscript.createdBy === userId)
    .catch(() => false)
}
