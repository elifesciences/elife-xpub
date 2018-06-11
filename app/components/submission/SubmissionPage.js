import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Formik } from 'formik'
import omitDeep from 'omit-deep-lodash'
import WithCurrentSubmission from './WithCurrentSubmission'
import ComponentWithSaving from './ComponentWithSaving'
import AuthorDetailsPage from './AuthorDetails/AuthorDetailsPage'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadata from './ManuscriptMetadata/ManuscriptMetadata'
import ReviewerSuggestions from './ReviewerSuggestions/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './FileUploads/FileUploadsSchema'
import { schema as authorDetailsSchema } from './AuthorDetails/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './ManuscriptMetadata/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './ReviewerSuggestions/ReviewerSuggestionsSchema'

const FormStep = ({
  component: Component,
  history,
  nextUrl,
  submitMutation,
  initialValues,
  validationSchema,
}) => (
  <Formik
    initialValues={initialValues}
    // ensure each page gets a new form instance otherwise all fields are touched
    key={Component.name}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const data = omitDeep(values, ['__typename', 'files'])
      return submitMutation({ variables: { data } })
        .then(() => setSubmitting(false))
        .then(() => history.push(nextUrl))
        .catch(errors => {
          setErrors(errors)
        })
    }}
    render={formProps => (
      <ComponentWithSaving updateSubmission={submitMutation} {...formProps}>
        <Component {...formProps} />
      </ComponentWithSaving>
    )}
    validationSchema={validationSchema}
  />
)

const SubmissionPage = ({ match, history }) => (
  <WithCurrentSubmission>
    {(initialValues, { updateSubmission, finishSubmission }) => (
      <Switch>
        <Route
          path={`${match.path}/upload`}
          render={() => (
            <FormStep
              component={FileUploadsPage}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              submitMutation={updateSubmission}
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/metadata`}
          render={() => (
            <FormStep
              component={ManuscriptMetadata}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/suggestions`}
              submitMutation={updateSubmission}
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/suggestions`}
          render={() => (
            <FormStep
              component={ReviewerSuggestions}
              history={history}
              initialValues={initialValues}
              nextUrl="/dashboard"
              submitMutation={updateSubmission}
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          render={() => (
            <FormStep
              component={AuthorDetailsPage}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              submitMutation={updateSubmission}
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
