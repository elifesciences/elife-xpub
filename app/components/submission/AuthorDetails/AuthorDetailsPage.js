import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'

import AuthorDetails from './AuthorDetails'
import WithCurrentSubmission from './WithCurrentSubmission'
import { schema } from './AuthorDetailsSchema'

const AuthorDetailsPage = ({ history }) => (
  <WithCurrentSubmission>
    {(updateSubmission, { loading, error, data }, createResult) => (
      <Formik
        component={AuthorDetails}
        initialValues={data.currentSubmission}
        onSubmit={values => {
          // console.log(values)
        }}
        validationSchema={schema}
      />
    )}
  </WithCurrentSubmission>
)

export default withRouter(AuthorDetailsPage)
