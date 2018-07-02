import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { GET_CURRENT_SUBMISSION } from '../submission/WithCurrentSubmission'
import Dashboard from './Dashboard'

const MANUSCRIPTS_QUERY = gql`
  query {
    manuscripts {
      id
      title
      submissionMeta {
        stage
      }
    }
  }
`

const DELETE_MANUSCRIPT_MUTATION = gql`
  mutation($id: ID!) {
    deleteManuscript(id: $id)
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

      return (
        <Mutation
          mutation={DELETE_MANUSCRIPT_MUTATION}
          refetchQueries={[
            { query: MANUSCRIPTS_QUERY },
            { query: GET_CURRENT_SUBMISSION },
          ]}
        >
          {deleteManuscript => (
            <Dashboard
              deleteManuscript={id => deleteManuscript({ variables: { id } })}
              manuscripts={data.manuscripts}
            />
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default DashboardPage
