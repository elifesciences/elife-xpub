import React from 'react'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'

import ReviewerSuggestions from './ReviewerSuggestions'
import { empty, schema } from './ReviewerSuggestionsSchema'

const ReviewerSuggestionsPage = () => (
  <Route>
    {({ history }) => (
      <Formik
        component={ReviewerSuggestions}
        initialValues={empty}
        onSubmit={() => history.push('/')}
        validationSchema={schema}
      />
    )}
  </Route>
)

export default ReviewerSuggestionsPage
