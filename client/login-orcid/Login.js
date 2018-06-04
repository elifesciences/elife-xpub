import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button } from '@pubsweet/ui'

class Login extends React.Component {
  constructor(props) {
    super(props)
    // save JWT to local storage if present
    const token = this.getToken()
    if (token) {
      window.localStorage.setItem('token', token)
    }
  }

  // parse JWT from the URL hash
  getToken() {
    const { location } = this.props
    if (location && location.hash) {
      return location.hash.substring(1)
    }
    return null
  }

  // show login button and redirect on sign in
  render() {
    const {
      redirectTo = '/',
      children = <Button>Sign in with ORCID</Button>,
    } = this.props

    if (this.getToken()) {
      return <Redirect to={redirectTo} />
    }

    return <a href="/auth/orcid">{children}</a>
  }
}

export default Login
