import { cloneDeep } from 'lodash'
import { graphql, compose } from 'react-apollo'
import React from 'react'
import omitDeep from 'omit-deep-lodash'
import ErrorPage from '../Error'
import { ALL_MANUSCRIPTS } from '../Dashboard/operations'
import {
  GET_MANUSCRIPT,
  UPDATE_MANUSCRIPT,
  SUBMIT_MANUSCRIPT,
} from './operations'
import CosubmissionModifier from './formDataModifiers/CosubmissionModifier'
import EditorSuggestionsModifier from './formDataModifiers/EditorSuggestionsModifier'

const dataModifiers = [
  new CosubmissionModifier(),
  new EditorSuggestionsModifier(),
]

function runMutation(formValues, mutation, { refetchQueries = [] } = {}) {
  const omitList = [
    '__typename',
    'files',
    'teams',
    'status',
    'clientStatus',
    'formState',
  ]

  dataModifiers.forEach(modifier => {
    omitList.push(...modifier.omitList())
  })

  const modifiedValues = omitDeep(formValues, omitList)

  dataModifiers.forEach(modifier => {
    modifier.fromForm(modifiedValues, formValues)
  })

  return mutation({
    refetchQueries,
    variables: { data: modifiedValues },
  })
}

const SubmissionOperations = ({
  children,
  data,
  updateManuscript,
  submitManuscript,
  ...props
}) => {
  if (data.loading) {
    return <div>Loading...</div>
  }

  if (data.error) {
    return <ErrorPage error={data.error} />
  }

  const initialValues = cloneDeep(data.manuscript)
  dataModifiers.forEach(modifier => {
    modifier.toForm(initialValues)
  })

  return children({
    initialValues,
    updateManuscript: newValues => runMutation(newValues, updateManuscript),
    submitManuscript: newValues =>
      runMutation(newValues, submitManuscript, {
        refetchQueries: [{ query: ALL_MANUSCRIPTS }],
      }),
  })
}

export default compose(
  graphql(UPDATE_MANUSCRIPT, { name: 'updateManuscript' }),
  graphql(SUBMIT_MANUSCRIPT, { name: 'submitManuscript' }),
  graphql(GET_MANUSCRIPT, {
    options: props => ({ variables: { id: props.manuscriptId } }),
  }),
)(SubmissionOperations)
