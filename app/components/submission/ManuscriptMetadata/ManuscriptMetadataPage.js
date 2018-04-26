import React from 'react'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'

import ManuscriptMetadata from './ManuscriptMetadata'
import { empty, schema } from './ManuscriptMetadataSchema'

export default () => (
  <Route>
    {({ history }) => (
      <Formik
        component={ManuscriptMetadata}
        initialValues={empty}
        onSubmit={() => history.push('/')}
        validationSchema={schema}
      />
    )}
  </Route>
)
