import React from 'react'
import _ from 'lodash'
import omitDeep from 'omit-deep-lodash'

export default class ComponentWithSaving extends React.Component {
  constructor(props) {
    /**
     * Component that will save submission on the backend on a time interval
     * This component is assumed to be used inside Formik
     * It also needs updateSubmission mutation
     */
    super(props)
    this.updateInterval = 5000
    this.oldValues = _.cloneDeep(this.props.initialValues)
    this.storeFormData = this.storeFormData.bind(this)
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.storeFormData(this.props.values)) {
        this.oldValues = _.cloneDeep(this.props.values)
      }
    }, this.updateInterval)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  storeFormData(values) {
    if (_.isEqual(this.oldValues, values)) {
      return false
    }
    const data = omitDeep(values, ['__typename', 'files'])
    this.props.updateSubmission({ variables: { data } })
    return true
  }
  render() {
    return this.props.children
  }
}
