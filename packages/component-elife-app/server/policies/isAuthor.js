module.exports = async (userId, operation, request, context) => {
  const { Manuscript } = context.models

  // There must be a more elegant way of doing this
  return Manuscript.findByIdAndAuthor(request.manuscriptId, userId)
    .then(() => true)
    .catch(() => false)
}
