import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Formik } from 'formik'
import omitDeep from 'omit-deep-lodash'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorDetails from './AuthorDetails/AuthorDetails'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadata from './ManuscriptMetadata/ManuscriptMetadata'
import ReviewerSuggestions from './ReviewerSuggestions/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './FileUploads/FileUploadsSchema'
import { schema as authorDetailsSchema } from './AuthorDetails/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './ManuscriptMetadata/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './ReviewerSuggestions/ReviewerSuggestionsSchema'

const FormStep = ({ history, updateSubmission, nextUrl, ...props }) => (
  <Formik
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const data = omitDeep(values, ['__typename', 'files'])
      return updateSubmission({ variables: { data } })
        .then(() => setSubmitting(false))
        .then(() => history.push(nextUrl))
        .catch(errors => {
          setErrors(errors)
        })
    }}
    {...props}
  />
)

const SubmissionPage = ({ match, history }) => (
  <WithCurrentSubmission>
    {(updateSubmission, initialValues) => (
      <Switch>
        <Route
          path={`${match.path}/upload`}
          render={() => (
            <FormStep
              component={FileUploadsPage}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              updateSubmission={updateSubmission}
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
              updateSubmission={updateSubmission}
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
              updateSubmission={updateSubmission}
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          render={() => (
            <FormStep
              component={AuthorDetails}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              updateSubmission={updateSubmission}
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
