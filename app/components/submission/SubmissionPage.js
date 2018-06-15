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

const FormStep = ({ history, nextUrl, submitMutation, ...props }) => (
  <Formik
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const data = omitDeep(values, ['__typename', 'files'])
      return submitMutation({ variables: { data } })
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
    {(initialValues, { updateSubmission, finishSubmission }) => (
      <Switch>
        <Route
          path={`${match.path}/upload`}
          render={() => (
            <FormStep
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              render={props => (
                <ComponentWithSaving
                  {...props}
                  updateSubmission={updateSubmission}
                >
                  <FileUploadsPage {...props} />
                </ComponentWithSaving>
              )}
              submitMutation={updateSubmission}
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/metadata`}
          render={() => (
            <FormStep
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/suggestions`}
              render={props => (
                <ComponentWithSaving
                  {...props}
                  updateSubmission={updateSubmission}
                >
                  <ManuscriptMetadata {...props} />
                </ComponentWithSaving>
              )}
              submitMutation={updateSubmission}
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/suggestions`}
          render={() => (
            <FormStep
              history={history}
              initialValues={initialValues}
              nextUrl="/dashboard"
              render={props => (
                <ComponentWithSaving
                  {...props}
                  updateSubmission={updateSubmission}
                >
                  <ReviewerSuggestions {...props} />
                </ComponentWithSaving>
              )}
              submitMutation={finishSubmission}
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          render={() => (
            <FormStep
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              render={props => (
                <ComponentWithSaving
                  {...props}
                  updateSubmission={updateSubmission}
                >
                  <AuthorDetailsPage {...props} />
                </ComponentWithSaving>
              )}
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
