import React from 'react'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'

import Manuscript from './Manuscript'
import { empty, schema } from './ManuscriptSchema'

export default () => (
  <Route>
    {({ history }) => (
      <Formik
        component={Manuscript}
        initialValues={empty}
        onSubmit={() => history.push('/')}
        validationSchema={schema}
      />
    )}
  </Route>
)
