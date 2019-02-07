import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Loading from 'ui/atoms/Loading'
import ThankYou from './ThankYou'
import ErrorPage from '../Error'

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
        return <Loading />
      }

      if (error) {
        return <ErrorPage error={error.message} />
      }

      return <ThankYou title={data.manuscript.meta.title} />
    }}
  </Query>
)

export default ThankYouPage
