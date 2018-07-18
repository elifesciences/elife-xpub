import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { GET_CURRENT_SUBMISSION } from '../SubmissionWizard/WithCurrentSubmission'
import Dashboard from './Dashboard'

export const MANUSCRIPTS_QUERY = gql`
  query DashboardManuscripts {
    manuscripts {
      id
      title
      submissionMeta {
        stage
      }
    }
  }
`

export const DELETE_MANUSCRIPT_MUTATION = gql`
  mutation DeleteManuscript($id: ID!) {
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
