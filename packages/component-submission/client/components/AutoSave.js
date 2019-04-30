import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { FORM_FIELDS_TO_OMIT } from '../utils/constants'

/**
 * Calls `onSave` on a timer but only if `values` changes
 */
export default class AutoSave extends React.Component {
  constructor(props) {
    super(props)
    this.updateInterval = 5000
    this.oldValues = _.cloneDeep(this.props.values)
  }

  componentDidMount() {
    this.timer = setInterval(() => this.save(), this.updateInterval)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.save()
  }

  save() {
    const oldValues = _.omit(this.oldValues, FORM_FIELDS_TO_OMIT)
    const currentValues = _.omit(this.props.values, FORM_FIELDS_TO_OMIT)

    if (!this.props.disabled && !_.isEqual(oldValues, currentValues)) {
      this.props.onSave(this.props.values)
      this.oldValues = _.cloneDeep(this.props.values)
    }
  }

  render() {
    return this.props.children || null
  }
}

AutoSave.propTypes = {
  disabled: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.any.isRequired,
}

AutoSave.defaultProps = {
  disabled: false,
}
