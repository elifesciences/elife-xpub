import React from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER } from '../graphql/queries'
import AppBar from './AppBar'
import ErrorBoundary from './ErrorBoundary'

// TODO: This could be achieved with a HOC wrapper
export default props => (
  <ErrorBoundary>
    <Query query={CURRENT_USER}>
      {({ data }) => {
        const { userMenuItems, defaultMenuItems } = props
        const user = data && data.currentUser
        const menuItems = [...(user ? userMenuItems : []), ...defaultMenuItems]
        return <AppBar menuItems={menuItems} user={user} />
      }}
    </Query>
  </ErrorBoundary>
)
