import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Dashboard from './Dashboard'

const MANUSCRIPTS_QUERY = gql`
  query {
    manuscripts {
      id
      title
    }
  }
`

const DashboardPage = () => (
  <Query query={MANUSCRIPTS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) {
        return <div>Loading...</div>
      }

      if (error) {
        return <div>{error.message}</div>
      }

      return <Dashboard manuscripts={data.manuscripts} />
    }}
  </Query>
)

export default DashboardPage
