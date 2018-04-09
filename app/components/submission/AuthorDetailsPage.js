import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

import AuthorDetails from './AuthorDetails'
import { schema } from './AuthorDetailsSchema'

const GET_AUTHOR_DETAILS = gql`
  query {
    currentSubmission @client {
      firstName
      lastName
      email
      institute
      assignee {
        firstName
        lastName
        email
      }
    }
  }
`

const UPDATE_AUTHOR_DETAILS = gql`
  mutation($input: String) {
    updateCurrentSubmission(input: $input) @client
  }
`

const AuthorDetailsPage = ({ history }) => (
  <Query query={GET_AUTHOR_DETAILS}>
    {({ loading, error, data, client }) => {
      if (loading) return <div>Loading...</div>
      if (error) return <div>Error: {String(error)}</div>

      return (
        <Mutation mutation={UPDATE_AUTHOR_DETAILS}>
          {updateAuthorDetails => (
            <Formik
              component={AuthorDetails}
              initialValues={data.currentSubmission}
              onSubmit={values => {
                updateAuthorDetails({
                  variables: { input: JSON.stringify(values) },
                })
                history.push('/submit/upload')
              }}
              validationSchema={schema}
            />
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default withRouter(AuthorDetailsPage)
