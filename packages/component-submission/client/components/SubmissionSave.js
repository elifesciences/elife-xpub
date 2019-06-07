import React from 'react'
import { omit, isEqual, cloneDeep } from 'lodash'
import { FORM_FIELDS_TO_OMIT } from '../utils/constants'

class SubmissionSave extends React.Component {
  constructor(props) {
    super(props)
    this.previousValues = cloneDeep(props.values)
    this.state = {
      isSaving: false,
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.save, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  save = () => {
    const filteredPreviousValues = omit(
      this.previousValues,
      FORM_FIELDS_TO_OMIT,
    )
    const filteredCurrentValues = omit(this.props.values, FORM_FIELDS_TO_OMIT)

    if (
      !this.props.disabled &&
      !this.state.isSaving &&
      !isEqual(filteredPreviousValues, filteredCurrentValues)
    ) {
      this.previousValues = cloneDeep(this.props.values)
      this.setState({ isSaving: true })

      this.props
        .handleSave(filteredCurrentValues)
        .then(() => this.setState({ isSaving: false }))
        .catch(() => this.setState({ isSaving: false }))
    }
  }

  render() {
    return null
  }
}

export default SubmissionSave
