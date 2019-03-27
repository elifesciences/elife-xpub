import React from 'react'
import { Query } from 'react-apollo'
import Loading from '@elifesciences/component-elife-ui/client/ui/atoms/Loading'

const ManuscriptsQuery = ({ query, children }) => (
  <Query fetchPolicy="cache-and-network" query={query}>
    {({ data, loading, error }) => {
      if (loading && !data.manuscripts) {
        return <Loading />
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
