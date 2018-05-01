import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'
import omitDeep from 'omit-deep-lodash'

import AuthorDetails from './AuthorDetails'
import WithCurrentSubmission from '../WithCurrentSubmission'
import { schema } from './AuthorDetailsSchema'

const AuthorDetailsPage = ({ history }) => (
  <WithCurrentSubmission>
    {(updateSubmission, initialValues) => (
      <Formik
        component={AuthorDetails}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          const data = omitDeep(values, '__typename')
          return updateSubmission({ variables: { data } })
            .then(() => setSubmitting(false))
            .then(() => history.push('/submit/upload'))
            .catch(errors => {
              setErrors(errors)
            })
        }}
        validationSchema={schema}
      />
    )}
  </WithCurrentSubmission>
)

export default withRouter(AuthorDetailsPage)
