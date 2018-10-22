import React from 'react'
import { Query } from 'react-apollo'

const ManuscriptsQuery = ({ query, children }) => (
  <Query fetchPolicy="cache-and-network" query={query}>
    {({ data, loading, error }) => {
      if (loading && !data.manuscripts) {
        return <div>Loading...</div>
      }

      if (error) {
        return <div>{error.message}</div>
      }

      return React.Children.map(children, child =>
        React.cloneElement(child, { manuscripts: data.manuscripts }),
      )
    }}
  </Query>
)

export default ManuscriptsQuery
