import React from 'react'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import config from 'config'

class LogoutPage extends React.Component {
  constructor(props) {
    super(props)
    window.localStorage.removeItem('token')
    this.props.client.resetStore()

    if (config.logout.redirectUrl) {
      window.location = config.logout.redirectUrl
    }
  }

  render() {
    return <Redirect to="/" />
  }
}

export default withApollo(LogoutPage)
