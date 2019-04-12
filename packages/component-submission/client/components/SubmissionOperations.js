import React from 'react'
import { graphql, compose } from 'react-apollo'
import { ALL_MANUSCRIPTS } from '@elifesciences/component-dashboard/client/graphql/queries'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { ErrorPage } from '@elifesciences/component-elife-app/client'

import { UPDATE_MANUSCRIPT, SUBMIT_MANUSCRIPT } from './operations'
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
        refetchQueries: [{ query: ALL_MANUSCRIPTS }],
        variables: { data: parseFormToOutputData(formValues) },
      }),
    submitManuscript: formValues =>
      submitManuscript({
        refetchQueries: [{ query: ALL_MANUSCRIPTS }],
        variables: { data: parseFormToOutputData(formValues) },
      }),
  })
}

export default compose(
  graphql(UPDATE_MANUSCRIPT, { name: 'updateManuscript' }),
  graphql(SUBMIT_MANUSCRIPT, { name: 'submitManuscript' }),
)(SubmissionOperations)
