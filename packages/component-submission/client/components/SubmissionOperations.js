import React from 'react'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { ErrorPage } from '@elifesciences/component-elife-app/client'

import { parseFormToOutputData, parseInputToFormData } from '../utils'

const SubmissionOperations = ({
  children,
  data,
  updateManuscript,
  submitManuscript,
  ...props
}) => {
  if (data.loading) {
    return <Loading />
  }

  if (data.error) {
    return <ErrorPage error={data.error} />
  }

  return children({
    initialValues: parseInputToFormData(data.manuscript),
    updateManuscript: formValues =>
      updateManuscript({
        variables: { data: parseFormToOutputData(formValues) },
      }),
    submitManuscript: formValues =>
      submitManuscript({
        variables: { data: parseFormToOutputData(formValues) },
      }),
  })
}

export default SubmissionOperations
