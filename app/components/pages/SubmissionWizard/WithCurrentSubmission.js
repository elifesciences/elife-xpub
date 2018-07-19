import { cloneDeep } from 'lodash'
import { withApollo } from 'react-apollo'
import React from 'react'
import omitDeep from 'omit-deep-lodash'
import ErrorPage from '../Error'
import { MANUSCRIPTS_QUERY } from '../Dashboard'
import {
  GET_CURRENT_SUBMISSION,
  CREATE_SUBMISSION,
  UPDATE_SUBMISSION,
  FINISH_SUBMISSION,
} from './operations'

/*
 * Data Modifiers -
 *    CosubmissionModifier
 *
 * These classes provide a common interface for the main class
 * 'WithCurrentSubmission' to delgate transforming the data model to the
 * view model.
 */
class CosubmissionModifier {
  omitList = () => [
    'submissionMeta.firstCosubmissionTitle',
    'submissionMeta.secondCosubmissionTitle',
  ]

  setData = data => {
    const metadata = (data.createSubmission || data.currentSubmission)
      .submissionMeta
    const cosub = metadata.cosubmission

    const cosubLen = cosub.length
    if (cosubLen) {
      metadata.firstCosubmissionTitle = cosub[0].title
    } else {
      metadata.firstCosubmissionTitle = null
    }

    if (cosubLen > 1) {
      metadata.secondCosubmissionTitle = cosub[1].title
    } else {
      metadata.secondCosubmissionTitle = null
    }
  }

  getData = (data, values) => {
    const target = data.submissionMeta
    const first = values.submissionMeta.firstCosubmissionTitle
    const second = values.submissionMeta.secondCosubmissionTitle
    const cosub = []

    if (typeof first === 'string' && first.length) {
      cosub.push({ title: first })
    }

    if (typeof second === 'string' && second.length) {
      cosub.push({ title: second })
    }

    // only update if there was any data found
    if (cosub.length) {
      target.cosubmission = cosub
    }
  }
}

class WithCurrentSubmission extends React.Component {
  state = { error: null, data: null, loading: true }

  componentDidMount() {
    this.querySubscription = this.props.client
      .watchQuery({ query: GET_CURRENT_SUBMISSION })
      .subscribe(
        ({ data }) => {
          if (data.currentSubmission) {
            this.setData(data)
          } else {
            this.props.client
              .mutate({
                mutation: CREATE_SUBMISSION,
                refetchQueries: [{ query: GET_CURRENT_SUBMISSION }],
              })
              .then(result => this.setData(result.data))
              .catch(error => this.setError(error))
          }
        },
        error => this.setError(error),
      )
  }

  componentWillUnmount() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
      delete this.querySubscription
    }
  }

  //
  dataModifiers = [new CosubmissionModifier()]

  setData(data) {
    const newData = cloneDeep(data)
    this.dataModifiers.forEach(modifier => {
      modifier.setData(newData)
    })
    this.setState({ data: newData, error: undefined, loading: false })
  }

  setError(error) {
    this.setState({ data: null, error, loading: false })
  }

  mutate(values, mutation, { isAutoSave = false, refetchQueries = [] } = {}) {
    const omitList = [
      '__typename',
      'files',
      'manuscriptPersons',
      'submissionMeta.stage',
    ]

    this.dataModifiers.forEach(modifier => {
      omitList.push(...modifier.omitList())
    })

    const data = omitDeep(values, omitList)

    this.dataModifiers.forEach(modifier => {
      modifier.getData(data, values)
    })

    return this.props.client.mutate({
      mutation,
      refetchQueries,
      variables: { data, isAutoSave },
    })
  }

  render() {
    const { loading, error, data } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <ErrorPage error={error} />
    }

    const initialValues =
      data && (data.currentSubmission || data.createSubmission)

    return this.props.children({
      initialValues,
      updateSubmission: values =>
        this.mutate(values, UPDATE_SUBMISSION, { isAutoSave: true }),
      progressSubmission: values => this.mutate(values, UPDATE_SUBMISSION),
      finishSubmission: values =>
        this.mutate(values, FINISH_SUBMISSION, {
          refetchQueries: [
            { query: GET_CURRENT_SUBMISSION },
            { query: MANUSCRIPTS_QUERY },
          ],
        }),
    })
  }
}

export default withApollo(WithCurrentSubmission)
