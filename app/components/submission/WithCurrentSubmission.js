import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import React from 'react'

export const GET_CURRENT_SUBMISSION = gql`
  query CurrentSubmission {
    currentSubmission {
      id
      title
      source
    }
  }
`

const WithCurrentSubmission = ({ children }) => (
  <Query query={GET_CURRENT_SUBMISSION}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>

      if (error) {
        return <div>{error.message}</div>
      }

      if (!data.currentSubmission) {
        // create submission
      }

      const childrenWithData = React.Children.map(children, child =>
        React.cloneElement(child, { data }),
      )
      console.log(
        '>>>>> app/components/submission/WithCurrentSubmission.js:25\n',
        'data:',
        data,
      )

      return <div>{childrenWithData}</div>
    }}
  </Query>
)

export default WithCurrentSubmission
