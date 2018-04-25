import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import AuthorDetails from './AuthorDetails'
import WithCurrentSubmission from './WithCurrentSubmission'
/* import { schema } from './AuthorDetailsSchema' */

/**
 * TODO
 * have a design discussion on how to send form data from frontend
 * entire form vs individual pages at once
 */
const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($data: ManuscriptInput!) {
    updateSubmission(data: $data) {
      id
      title
      submissionMeta {
        author {
          firstName
          lastName
          email
          institution
        }
        displayCorrespondent
        correspondent {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

const AuthorDetailsPage = ({ history }) => (
  <WithCurrentSubmission>
    {data => (
      // console.log("data = ");
      // console.log(data.currentSubmission);
      /* <div>{JSON.stringify(data, null, 2)}</div> */
      <Mutation mutation={UPDATE_SUBMISSION}>
        {(updateSubmission, _) => (
          <Formik
            component={AuthorDetails}
            /**
             * stuff should be in submissionMeta.author
             * and submissionMeta.correspondent
             *
             * data.currentSubmission.submissionMeta
             *   {author, correspondent}
             *
             * TODO get data from form
             */
            initialValues={data.currentSubmission}
            onSubmit={values => {
              // console.log("ehllo");
              console.log(values)
            }}
            /* validationSchema={schema} */
          />
        )}
      </Mutation>
    )}
  </WithCurrentSubmission>
)

export default withRouter(AuthorDetailsPage)
