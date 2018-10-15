import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import ThankYou from './ThankYou'

const MANUSCRIPT_TITLE = gql`
  query GetManuscript($id: ID!) {
    manuscript(id: $id) {
      meta {
        title
      }
    }
  }
`
const ThankYouPage = ({ match }) => (
  <Query query={MANUSCRIPT_TITLE} variables={{ id: match.params.id }}>
    {({ data, loading, error }) => {
      if (loading) {
        return <div>Loading...</div>
      }

      if (error) {
        return <div>{error.message}</div>
      }

      return <ThankYou title={data.manuscript.meta.title} />
    }}
  </Query>
)

export default ThankYouPage
