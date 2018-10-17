import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { CREATE_MANUSCRIPT } from '../SubmissionWizard/operations'
import Dashboard from './Dashboard'
import ErrorPage from '../Error'

export const MANUSCRIPTS = gql`
  query DashboardManuscripts {
    manuscripts {
      id
      created
      meta {
        title
      }
      clientStatus
    }
  }
`

export const DELETE_MANUSCRIPT = gql`
  mutation DeleteManuscript($id: ID!) {
    deleteManuscript(id: $id)
  }
`

const DashboardPage = ({ history }) => (
  <Query query={MANUSCRIPTS}>
    {({ data, loading, error }) => {
      if (loading) {
        return <div>Loading...</div>
      }

      if (error) {
        return <ErrorPage error={error.message} />
      }

      return (
        <Mutation
          mutation={DELETE_MANUSCRIPT}
          refetchQueries={[{ query: MANUSCRIPTS }]}
        >
          {deleteManuscript => (
            <Mutation mutation={CREATE_MANUSCRIPT}>
              {createManuscript => (
                <Dashboard
                  createManuscript={() =>
                    createManuscript().then(result =>
                      history.push(
                        `/submit/${result.data.createManuscript.id}`,
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
