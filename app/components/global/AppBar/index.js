import React from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER } from '../queries'
import AppBar from './AppBar'

export default () => (
  <Query query={CURRENT_USER}>
    {({ data }) => <AppBar user={data.currentUser} />}
  </Query>
)
