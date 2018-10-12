import React from 'react'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'

class LogoutPage extends React.Component {
  constructor(props) {
    super(props)
    window.localStorage.removeItem('token')
    this.props.client.resetStore()
  }

  render() {
    return <Redirect to="/" />
  }
}

export default withApollo(LogoutPage)
