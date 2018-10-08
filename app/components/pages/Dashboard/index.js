import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { CREATE_SUBMISSION } from '../SubmissionWizard/operations'
import Dashboard from './Dashboard'

export const MANUSCRIPTS_QUERY = gql`
  query DashboardManuscripts {
    manuscripts {
      id
      meta {
        title
      }
      status
    }
  }
`

export const DELETE_MANUSCRIPT_MUTATION = gql`
  mutation DeleteManuscript($id: ID!) {
    deleteManuscript(id: $id)
  }
`

const DashboardPage = ({ history }) => (
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
          refetchQueries={[{ query: MANUSCRIPTS_QUERY }]}
        >
          {deleteManuscript => (
            <Mutation mutation={CREATE_SUBMISSION}>
              {createSubmission => (
                <Dashboard
                  createSubmission={() =>
                    createSubmission().then(result =>
                      history.push(
                        `/submit/${result.data.createSubmission.id}`,
                      ),
                    )
                  }
                  deleteManuscript={id =>
                    deleteManuscript({ variables: { id } })
                  }
                  manuscripts={data.manuscripts}
                />
              )}
            </Mutation>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default DashboardPage
