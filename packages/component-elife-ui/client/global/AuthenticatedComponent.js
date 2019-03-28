import React from 'react'
import { Redirect } from 'react-router'
import { Query } from 'react-apollo'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { ErrorPage } from '@elifesciences/component-elife-ui/client'
import { CURRENT_USER } from '../../../../app/client/graphql/queries'

const AuthenticatedComponent = ({ children }) => (
  <Query query={CURRENT_USER}>
    {({ loading, error, data }) => {
      if (!window.localStorage.getItem('token')) {
        return <Redirect to="/login" />
      }

      if (loading) return <Loading />

      if (error) {
        return <ErrorPage error={error} />
      }

      if (!data.currentUser) {
        return <Redirect to="/login" />
      }

      return children
    }}
  </Query>
)

export default AuthenticatedComponent
