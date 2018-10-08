import { cloneDeep } from 'lodash'
import { withApollo } from 'react-apollo'
import React from 'react'
import omitDeep from 'omit-deep-lodash'
import ErrorPage from '../Error'
import { MANUSCRIPTS_QUERY } from '../Dashboard'
import {
  GET_MANUSCRIPT,
  UPDATE_SUBMISSION,
  FINISH_SUBMISSION,
} from './operations'
import CosubmissionModifier from './formDataModifiers/CosubmissionModifier'
import EditorSuggestionsModifier from './formDataModifiers/EditorSuggestionsModifier'

class WithCurrentSubmission extends React.Component {
  state = { error: null, values: null, loading: true }

  componentDidMount() {
    this.querySubscription = this.props.client
      .watchQuery({
        query: GET_MANUSCRIPT,
        variables: { id: this.props.manuscriptId },
      })
      .subscribe(
        ({ data }) => this.setData(data),
        error => this.setError(error),
      )
  }

  componentWillUnmount() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
      delete this.querySubscription
    }
  }

  dataModifiers = [new CosubmissionModifier(), new EditorSuggestionsModifier()]

  setData(data) {
    const values = cloneDeep(data.manuscript)
    this.dataModifiers.forEach(modifier => {
      modifier.toForm(values)
    })
    this.setState({ values, error: undefined, loading: false })
  }

  setError(error) {
    this.setState({ values: null, error, loading: false })
  }

  mutate(
    formValues,
    mutation,
    { isAutoSave = false, refetchQueries = [] } = {},
  ) {
    const omitList = ['__typename', 'files', 'teams', 'status']

    this.dataModifiers.forEach(modifier => {
      omitList.push(...modifier.omitList())
    })

    const modifiedValues = omitDeep(formValues, omitList)

    this.dataModifiers.forEach(modifier => {
      modifier.fromForm(modifiedValues, formValues)
    })

    return this.props.client.mutate({
      mutation,
      refetchQueries,
      variables: { data: modifiedValues, isAutoSave },
    })
  }

  render() {
    const { loading, error, values: initialValues } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <ErrorPage error={error} />
    }

    return this.props.children({
      initialValues,
      updateSubmission: newValues =>
        this.mutate(newValues, UPDATE_SUBMISSION, { isAutoSave: true }),
      progressSubmission: newValues =>
        this.mutate(newValues, UPDATE_SUBMISSION),
      finishSubmission: newValues =>
        this.mutate(newValues, FINISH_SUBMISSION, {
          refetchQueries: [{ query: MANUSCRIPTS_QUERY }],
        }),
    })
  }
}

export default withApollo(WithCurrentSubmission)
