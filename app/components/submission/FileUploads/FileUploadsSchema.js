import yup from 'yup'

const MIN_WORDS = 57

function stripHtml(html) {
  const htmlWithLineBreaks = html.replace(/<\/p>/g, '</p>\n')
  const doc = new DOMParser().parseFromString(htmlWithLineBreaks, 'text/html')
  return doc.body.textContent || ''
}

const schema = yup.object().shape({
  submissionMeta: yup.object({
    coverLetter: yup
      .string()
      .test(
        'hasContent',
        'Your cover letter should be longer',
        value => stripHtml(value).split(/\s/).length > MIN_WORDS,
      ),
  }),
  files: yup.array().min(1, 'Please upload a manuscript'),
})

export { schema }
