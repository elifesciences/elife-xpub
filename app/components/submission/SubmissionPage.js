import React from 'react'
import { Route, Switch } from 'react-router-dom'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorDetailsPage from './AuthorDetails/AuthorDetailsPage'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadata from './ManuscriptMetadata/ManuscriptMetadata'
import ReviewerSuggestions from './ReviewerSuggestions/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './FileUploads/FileUploadsSchema'
import { schema as authorDetailsSchema } from './AuthorDetails/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './ManuscriptMetadata/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './ReviewerSuggestions/ReviewerSuggestionsSchema'
import WizardStep from './WizardStep'

const SubmissionPage = ({ match, history }) => (
  <WithCurrentSubmission>
    {({
      initialValues,
      updateSubmission,
      progressSubmission,
      finishSubmission,
    }) => (
      <Switch>
        <Route
          exact
          path={`${match.path}/upload`}
          render={() => (
            <WizardStep
              component={FileUploadsPage}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/metadata`}
          render={() => (
            <WizardStep
              component={ManuscriptMetadata}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/suggestions`}
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/suggestions`}
          render={() => (
            <WizardStep
              component={ReviewerSuggestions}
              handleSubmit={finishSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl="/dashboard"
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          render={() => (
            <WizardStep
              component={AuthorDetailsPage}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
