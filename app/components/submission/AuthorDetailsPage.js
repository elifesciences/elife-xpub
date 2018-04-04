import React from 'react'
import { Formik } from 'formik'
import { withRouter } from 'react-router-dom'

import AuthorDetails from './AuthorDetails'
import { schema, empty } from './AuthorDetailsSchema'

const AuthorDetailsPage = ({ history }) => (
  <Formik
    component={AuthorDetails}
    initialValues={empty}
    onSubmit={values => {
      history.push('/submit/upload')
    }}
    validationSchema={schema}
  />
)

export default withRouter(AuthorDetailsPage)
