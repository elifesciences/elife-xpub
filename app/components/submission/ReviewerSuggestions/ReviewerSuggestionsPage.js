import React from 'react'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'
import omitDeep from 'omit-deep-lodash'

import WithCurrentSubmission from '../WithCurrentSubmission'
import ReviewerSuggestions from './ReviewerSuggestions'
import { schema } from './ReviewerSuggestionsSchema'

const ReviewerSuggestionsPage = () => (
  <Route>
    {({ history }) => (
      <WithCurrentSubmission>
        {(updateSubmission, initialValues) => (
          <Formik
            component={ReviewerSuggestions}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              const data = omitDeep(values, '__typename')
              return updateSubmission({ variables: { data } })
                .then(() => setSubmitting(false))
                .then(() => history.push('/'))
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

export default ReviewerSuggestionsPage
