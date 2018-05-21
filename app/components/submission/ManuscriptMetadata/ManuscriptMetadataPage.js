import React from 'react'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'
import omitDeep from 'omit-deep-lodash'

import WithCurrentSubmission from '../WithCurrentSubmission'
import ManuscriptMetadata from './ManuscriptMetadata'
import { schema } from './ManuscriptMetadataSchema'

export default () => (
  <Route>
    {({ history }) => (
      <WithCurrentSubmission>
        {(updateSubmission, initialValues) => (
          <Formik
            component={ManuscriptMetadata}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              const data = omitDeep(values, ['__typename', 'files'])
              return updateSubmission({ variables: { data } })
                .then(() => setSubmitting(false))
                .then(() => history.push('/submit/suggestions'))
                .catch(errors => {
                  setErrors(errors)
                })
            }}
            validationSchema={schema}
          />
        )}
      </WithCurrentSubmission>
    )}
  </Route>
)
