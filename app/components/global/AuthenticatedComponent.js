import React from 'react'
import { Redirect } from 'react-router'
import { Query } from 'react-apollo'
import { CURRENT_USER } from './queries'

const AuthenticatedComponent = ({ children }) => (
  <Query query={CURRENT_USER}>
    {({ loading, error, data }) => {
      if (!window.localStorage.getItem('token')) {
        return <Redirect to="/login" />
      }

      if (loading) return 'Loading...'

      if (error) return <div>{error.message}</div>

      if (data.currentUser && !data.currentUser.user) {
        return <Redirect to="/login" />
      }

      return children
    }}
  </Query>
)

export default AuthenticatedComponent
