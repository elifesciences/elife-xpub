import React from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER } from '../queries'
import ErrorBoundary from '../ErrorBoundary'
import AppBar from './AppBar'

export default props => (
  <ErrorBoundary>
    <Query query={CURRENT_USER}>
      {({ data }) => <AppBar user={data && data.currentUser} {...props} />}
    </Query>
  </ErrorBoundary>
)
