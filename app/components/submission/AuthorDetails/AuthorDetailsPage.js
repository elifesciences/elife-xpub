import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'

import AuthorDetails from './AuthorDetails'
import WithCurrentSubmission from './WithCurrentSubmission'
import { schema } from './AuthorDetailsSchema'

const AuthorDetailsPage = ({ history }) => (
  <WithCurrentSubmission>
    {(updateSubmission, { loading, error, data }, initialValues) => (
      <Formik
        component={AuthorDetails}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          console.log(
            '>>>>> app/components/submission/AuthorDetailsPage.js:16\n',
            'values:',
            values,
          )
          return updateSubmission()
            .then(() => setSubmitting(false))
            .then(() => history.push('/'))
        }}
        validationSchema={schema}
      />
    )}
  </WithCurrentSubmission>
)

export default withRouter(AuthorDetailsPage)
