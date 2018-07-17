import React from 'react'
import { Route, Switch } from 'react-router-dom'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorDetailsPage from './steps/Author/AuthorDetailsPage'
import FileUploadsPage from './steps/Files/FileUploadsPage'
import ManuscriptMetadata from './steps/Submission/ManuscriptMetadata'
import ReviewerSuggestions from './steps/Editors/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './steps/Files/FileUploadsSchema'
import { schema as authorDetailsSchema } from './steps/Author/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './steps/Submission/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './steps/Editors/ReviewerSuggestionsSchema'
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
              previousUrl={`${match.path}`}
              step={1}
              title="Write your cover letter and upload your manuscript"
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
              previousUrl={`${match.path}/upload`}
              step={2}
              title="Help us get your work seen by the right people"
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
              previousUrl={`${match.path}/metadata`}
              step={3}
              submitButtonText="Submit"
              title="Who should review your work?"
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
              step={0}
              title="Who is the corresponding author?"
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
