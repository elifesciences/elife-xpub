import React from 'react'
import { Redirect } from 'react-router'
import { Query } from 'react-apollo'
import jwt from 'jsonwebtoken'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { ErrorPage } from '@elifesciences/component-elife-app/client'
import { CURRENT_USER } from '../graphql/queries'

const isTokenValid = token => {
  if (!token) {
    return false
  }

  const parsedToken = jwt.decode(token, { json: true })

  if (!parsedToken) {
    return false
  }

  return parsedToken.exp > Math.round(new Date().getTime() / 1000)
}

const AuthenticatedComponent = ({ children }) => (
  <Query query={CURRENT_USER}>
    {({ loading, error, data }) => {
      const token = window.localStorage.getItem('token')

      if (!isTokenValid(token)) {
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
