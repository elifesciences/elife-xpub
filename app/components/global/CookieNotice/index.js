import React from 'react'
import Helpers from './helpers'

class CookieNotice extends React.Component {
  constructor(props) {
    super(props)

    this.document = props.document || document
  }

  previouslyAccepted() {
    return Helpers.getCookieValue('previouslyAccepted', this.document.cookie)
  }
  render() {
    if (!this.previouslyAccepted()) {
      return <div>Cookie to go here</div>
    }

    return null
  }
}

export default CookieNotice
